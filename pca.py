import pandas as pd
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt

# Load data
df_a = pd.read_csv('A_test_data.tsv', sep='\t')
df_b = pd.read_csv('B_test_data.tsv', sep='\t')

# Add labels to datasets for distinction
df_a['Test'] = 'A'
df_b['Test'] = 'B'

# Combine datasets
combined_df = pd.concat([df_a, df_b], ignore_index=True)

# Columns for PCA
columns_for_pca = [
    'Gaze point X', 'Gaze point Y',
    'Gaze point left X', 'Gaze point left Y',
    'Gaze point right X', 'Gaze point right Y'
]

# Drop rows with missing values
pca_df = combined_df[columns_for_pca + ['Test']].dropna()

# Standardize data
scaler = StandardScaler()
scaled_data = scaler.fit_transform(pca_df[columns_for_pca])

# Perform PCA
pca = PCA(n_components=2)
principal_components = pca.fit_transform(scaled_data)

# PCA result with labels
pca_results_df = pd.DataFrame(principal_components, columns=['PC1', 'PC2'])
pca_results_df['Test'] = pca_df['Test'].values

# Explained variance
print(f'Explained variance ratio: {pca.explained_variance_ratio_}')

# Plot PCA results with distinction between tests
plt.figure(figsize=(10,7))

for label in pca_results_df['Test'].unique():
    subset = pca_results_df[pca_results_df['Test'] == label]
    plt.scatter(subset['PC1'], subset['PC2'], label=f'Test {label}', alpha=0.7, edgecolor='k')

plt.xlabel('Principal Component 1')
plt.ylabel('Principal Component 2')
plt.title('PCA of Combined Eye-tracking Gaze Data (A vs B)')
plt.legend()
plt.grid(True)
plt.show()
