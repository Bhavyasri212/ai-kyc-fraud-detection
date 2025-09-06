# gnn_kyc_model.py

import torch
import torch.nn.functional as F
import pandas as pd
import networkx as nx
from torch_geometric.utils import from_networkx
from torch_geometric.nn import GCNConv

# Step 1: Load dataset
df = pd.read_csv("kyc_data.csv")

# Step 2: Create NetworkX graph
G = nx.Graph()

for _, row in df.iterrows():
    G.add_node(row["user_id"], 
               name=row["name"], 
               dob=row["dob"], 
               gender=1 if row["gender"] == "M" else 0,
               is_fraud=int(row["is_fraud"]))

# Create edges based on Aadhaar, PAN, address matches
for i, row1 in df.iterrows():
    for j, row2 in df.iterrows():
        if i >= j:
            continue
        if row1["aadhaar_number"] == row2["aadhaar_number"]:
            G.add_edge(row1["user_id"], row2["user_id"], type="aadhaar")
        if row1["pan_number"] == row2["pan_number"]:
            G.add_edge(row1["user_id"], row2["user_id"], type="pan")
        if row1["address"] == row2["address"]:
            G.add_edge(row1["user_id"], row2["user_id"], type="address")

# Convert to PyTorch Geometric Data
data = from_networkx(G)

# Step 3: Create dummy node features (one-hot)
num_nodes = len(data.x)
data.x = torch.eye(num_nodes)  # Identity matrix as features

# Labels
data.y = torch.tensor([G.nodes[n]["is_fraud"] for n in G.nodes()], dtype=torch.long)

# Step 4: Define GNN model
class FraudGNN(torch.nn.Module):
    def __init__(self, in_channels, hidden_channels):
        super().__init__()
        self.conv1 = GCNConv(in_channels, hidden_channels)
        self.conv2 = GCNConv(hidden_channels, 2)

    def forward(self, x, edge_index):
        x = self.conv1(x, edge_index)
        x = F.relu(x)
        x = self.conv2(x, edge_index)
        return F.log_softmax(x, dim=1)

# Step 5: Training
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = FraudGNN(in_channels=data.x.shape[1], hidden_channels=16).to(device)
data = data.to(device)
optimizer = torch.optim.Adam(model.parameters(), lr=0.01)

for epoch in range(100):
    model.train()
    optimizer.zero_grad()
    out = model(data.x, data.edge_index)
    loss = F.nll_loss(out, data.y)
    loss.backward()
    optimizer.step()
    if epoch % 10 == 0:
        print(f"Epoch {epoch}: Loss = {loss.item():.4f}")

# Step 6: Prediction
model.eval()
pred = model(data.x, data.edge_index).argmax(dim=1)

print("\n🔍 Fraud Predictions:")
for idx, node_id in enumerate(G.nodes()):
    status = "🚨 FRAUD" if pred[idx] == 1 else "✅ LEGIT"
    print(f"User {node_id}: {status}")
