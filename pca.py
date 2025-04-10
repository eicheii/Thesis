# Import necessary libraries
import numpy as np
import pandas as pd
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt

# Example dataset creation
np.random.seed(42)
data = np.random.rand(100, 4)  # 100 samples, 4 features
df = pd.DataFrame(data, columns=['Feature1', 'Feature2', 'Feature3', 'Feature4'])

# Standardize the data
scaler = StandardScaler()
scaled_data = scaler.fit_transform(df)

# Perform PCA
pca = PCA(n_components=2)  # reduce to 2 principal components
principal_components = pca.fit_transform(scaled_data)

# Create a DataFrame for visualization
pca_df = pd.DataFrame(data=principal_components, columns=['PC1', 'PC2'])

# Explained variance
print(f'Explained variance ratio: {pca.explained_variance_ratio_}')

# Plot the PCA result
plt.figure(figsize=(8,6))
plt.scatter(pca_df['PC1'], pca_df['PC2'], edgecolor='k', alpha=0.7)
plt.xlabel('Principal Component 1')
plt.ylabel('Principal Component 2')
plt.title('PCA - Principal Component Analysis')
plt.grid(True)
plt.show()

