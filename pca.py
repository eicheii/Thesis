import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt

# Läs in din CSV-fil
df = pd.read_csv("din_fil.tsv", sep="\t")  # <--- det viktiga är sep="\t"

# Om du har en kolumn med klasser/etiketter (t.ex. 'label'), separera den:
X = df.drop(columns=['label'])  # byt ut 'label' mot rätt kolumnnamn
y = df['label']

# Standardisera funktionerna
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# PCA
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)

# Visualisering
plt.figure(figsize=(8, 6))
for label in y.unique():
    plt.scatter(X_pca[y == label, 0], X_pca[y == label, 1], label=label)
plt.xlabel('Principal Component 1')
plt.ylabel('Principal Component 2')
plt.title('PCA - Egen CSV-fil')
plt.legend()
plt.grid(True)
plt.show()
