from sklearn.decomposition import PCA
import pandas as pd

# Load the data
a_path = 'A.csv'
b_path = 'B.csv'

a_df = pd.read_csv(a_path)
b_df = pd.read_csv(b_path)

# Assign group labels
a_df['Group'] = 'A'
b_df['Group'] = 'B'

# Combine datasets
combined_df = pd.concat([a_df, b_df], ignore_index=True)

# Drop non-feature columns
features = combined_df.drop(columns=['Participant name', 'Group'])

# Perform PCA
pca = PCA(n_components=2)
pca_result = pca.fit_transform(features)

# Get PCA loadings (contributions of each feature to PC1 and PC2)
loadings = pd.DataFrame(
    pca.components_.T,
    columns=['PC1', 'PC2'],
    index=features.columns
)

# Print the loadings
print("\nPCA Loadings (How much each feature contributes to PC1 and PC2):\n")
print(loadings)

# Optional: Save to CSV
loadings.to_csv("pca_loadings.csv")
