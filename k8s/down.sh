#!/bin/bash

CLUSTER_NAME="dev-cluster"

echo "🛑 Stopper og sletter $CLUSTER_NAME..."

if k3d cluster delete $CLUSTER_NAME; then
    echo "✅ Clusteret er slettet og ressurser er frigjort i OrbStack."
else
    echo "⚠️ Fant ingen cluster med navn $CLUSTER_NAME å slette."
fi