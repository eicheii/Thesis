from sklearn.decomposition import PCA
import matplotlib.pyplot as plt
import pandas as pd

# Load Group A and B standardized data
a_path = 'A.csv'
b_path = 'B.csv'

a_df = pd.read_csv(a_path)
b_df = pd.read_csv(b_path)

# Assign group labels
a_df['Group'] = 'A'
b_df['Group'] = 'B'

# Combine datasets
combined_df = pd.concat([a_df, b_df], ignore_index=True)

# Separate features and participant labels
features = combined_df.drop(columns=['Participant name', 'Group'])
participant_names = combined_df['Participant name']
group_labels = combined_df['Group']

# Perform PCA to reduce to 2 components
pca = PCA(n_components=2)
pca_result = pca.fit_transform(features)

# Flip PC2 for visual consistency (optional)
pca_result[:, 1] *= -1

# Create a DataFrame for plotting
pca_df = pd.DataFrame({
    'PC1': pca_result[:, 0],
    'PC2': pca_result[:, 1],
    'Group': group_labels,
    'Participant name': participant_names
})

# Define colors
group_colors = {'A': '#F07F92', 'B': '#94BDC3'}

# Plot
plt.figure(figsize=(8, 6))
for group, color in group_colors.items():
    subset = pca_df[pca_df['Group'] == group]
    plt.scatter(subset['PC1'], subset['PC2'], label=f'Group {group}', c=color, s=100, edgecolor='black')

plt.title('PCA of Eye Movement Features by Group')
plt.xlabel('Principal Component 1')
plt.ylabel('Principal Component 2')
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.show()
