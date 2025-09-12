import torch
import torch.nn.functional as F
from torch_geometric.data import Data
from torch_geometric.loader import DataLoader 
from torch_geometric.nn import GCNConv, global_mean_pool
import random
import numpy as np

# ------------------------
# Set random seed for reproducibility
# ------------------------
def set_seed(seed=42):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)

set_seed()

# ------------------------
# Generate Dummy Graph Dataset
# ------------------------

def generate_dummy_graph(label):
    # label: 0 = genuine, 1 = fraudulent
    # Create 4 nodes with 3 features each (random)
    x = torch.randn((4, 3), dtype=torch.float)

    # Simple edges (undirected)
    edge_index = torch.tensor(
        [[0, 1, 2, 3, 0],
         [1, 0, 3, 2, 2]], dtype=torch.long
    )

    y = torch.tensor([label], dtype=torch.long)  # Graph label

    return Data(x=x, edge_index=edge_index, y=y)

# ------------------------
# Model Definition
# ------------------------

class DocumentGNN(torch.nn.Module):
    def __init__(self):
        super(DocumentGNN, self).__init__()
        self.conv1 = GCNConv(3, 16)
        self.conv2 = GCNConv(16, 32)
        self.fc = torch.nn.Linear(32, 2)  # 2 classes

    def forward(self, data):
        x, edge_index, batch = data.x, data.edge_index, data.batch
        x = F.relu(self.conv1(x, edge_index))
        x = F.relu(self.conv2(x, edge_index))
        x = global_mean_pool(x, batch)  # Pool node features per graph
        x = self.fc(x)
        return F.log_softmax(x, dim=1)

# ------------------------
# Training Loop
# ------------------------

def train():
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model = DocumentGNN().to(device)
    optimizer = torch.optim.Adam(model.parameters(), lr=0.01)
    criterion = torch.nn.NLLLoss()

    # Create dataset: 100 genuine and 100 fraudulent graphs
    dataset = []
    for _ in range(100):
        dataset.append(generate_dummy_graph(0))  # genuine
        dataset.append(generate_dummy_graph(1))  # fraudulent

    loader = DataLoader(dataset, batch_size=16, shuffle=True)

    model.train()
    for epoch in range(50):
        total_loss = 0
        for batch in loader:
            batch = batch.to(device)
            optimizer.zero_grad()
            out = model(batch)  # shape: [batch_size, num_classes]
            loss = criterion(out, batch.y)  # batch.y shape: [batch_size]
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
        print(f"Epoch {epoch + 1}/50, Loss: {total_loss / len(loader):.4f}")

    # Save the model state_dict only (best practice)
    torch.save(model.state_dict(), "trained_gnn_model.pth")
    print("Training complete. Model saved as 'trained_gnn_model.pth'.")

# ------------------------
# Main
# ------------------------

if __name__ == "__main__":
    train()
