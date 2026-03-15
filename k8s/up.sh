#!/bin/bash

# OBS: Om du ønsker å slette clusteret, kjør `k3d cluster delete dev-cluster`

# Navnet på clusteret
CLUSTER_NAME="dev-cluster"

echo "🚀 Sjekker status for $CLUSTER_NAME..."

# Sjekk om clusteret allerede finnes
if k3d cluster list | grep -q "$CLUSTER_NAME"; then
    echo "✨ Clusteret finnes allerede."
    
    # Sjekk om det er stoppet eller kjører
    if k3d cluster list | grep "$CLUSTER_NAME" | grep -q "0/1"; then
        echo "💤 Clusteret er stoppet. Vekker det til live..."
        k3d cluster start $CLUSTER_NAME
    else
        echo "✅ Clusteret kjører allerede. Ingen handling nødvendig."
    fi
else
    # Opprett nytt cluster hvis det ikke finnes
    echo "🏗️ Fant ikke clusteret. Oppretter $CLUSTER_NAME med 2 agents..."
    k3d cluster create $CLUSTER_NAME \
        -p "8080:80@loadbalancer" \
        --agents 2
fi

echo "-------------------------------------------------------"
echo "🛠️ Synkroniserer konfigurasjon..."

# Bonus: Denne linjen gjør det trygt å kjøre scriptet når som helst
# Den oppdaterer Kubernetes-ressursene uten å slette dem
if [ -d "k8s" ]; then
    kubectl apply -f k8s/
    echo "📄 Kubernetes-ressurser oppdatert."
fi

echo "📍 Clusteret er klart på http://localhost:8080"
echo "-------------------------------------------------------"