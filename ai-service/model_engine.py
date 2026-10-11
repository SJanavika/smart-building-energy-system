"""
Model Engine: Pure Python Random Forest Regressor & Decision Tree
Zero-dependency ensemble learning for energy load forecasting.
"""

import math
import random

class PurePythonDecisionTree:
    def __init__(self, max_depth=8, min_samples_split=6):
        self.max_depth = max_depth
        self.min_samples_split = min_samples_split
        self.tree = None

    def fit(self, X, y):
        data = [x + [target] for x, target in zip(X, y)]
        self.tree = self._build_tree(data, depth=0)

    def _build_tree(self, data, depth):
        if not data:
            return 0.0
        targets = [row[-1] for row in data]
        if depth >= self.max_depth or len(data) <= self.min_samples_split or len(set(targets)) == 1:
            return sum(targets) / len(targets)

        best_feat = None
        best_val = None
        best_mse = float('inf')
        best_left, best_right = None, None

        n_features = len(data[0]) - 1
        features_to_check = random.sample(range(n_features), max(1, int(math.sqrt(n_features)) + 1))

        for feat in features_to_check:
            vals = [row[feat] for row in data]
            step = max(1, len(vals) // 10)
            thresholds = sorted(vals)[::step]
            for thresh in thresholds:
                left = [r for r in data if r[feat] <= thresh]
                right = [r for r in data if r[feat] > thresh]
                if not left or not right:
                    continue
                left_targets = [r[-1] for r in left]
                right_targets = [r[-1] for r in right]
                left_mean = sum(left_targets) / len(left_targets)
                right_mean = sum(right_targets) / len(right_targets)
                mse = sum((t - left_mean) ** 2 for t in left_targets) + sum((t - right_mean) ** 2 for t in right_targets)
                if mse < best_mse:
                    best_mse = mse
                    best_feat = feat
                    best_val = thresh
                    best_left = left
                    best_right = right

        if best_feat is None:
            return sum(targets) / len(targets)

        return {
            "feature": best_feat,
            "threshold": best_val,
            "left": self._build_tree(best_left, depth + 1),
            "right": self._build_tree(best_right, depth + 1)
        }

    def predict_one(self, node, x):
        if not isinstance(node, dict):
            return node
        if x[node["feature"]] <= node["threshold"]:
            return self.predict_one(node["left"], x)
        else:
            return self.predict_one(node["right"], x)

    def predict(self, X):
        return [self.predict_one(self.tree, x) for x in X]


class PurePythonRandomForest:
    def __init__(self, n_estimators=15, max_depth=7):
        self.n_estimators = n_estimators
        self.max_depth = max_depth
        self.trees = []

    def fit(self, X, y):
        self.trees = []
        n_samples = len(X)
        for _ in range(self.n_estimators):
            indices = [random.randint(0, n_samples - 1) for _ in range(n_samples)]
            sample_X = [X[i] for i in indices]
            sample_y = [y[i] for i in indices]
            tree = PurePythonDecisionTree(max_depth=self.max_depth)
            tree.fit(sample_X, sample_y)
            self.trees.append(tree)

    def predict(self, X):
        all_preds = [tree.predict(X) for tree in self.trees]
        n_items = len(X)
        averaged = []
        for i in range(n_items):
            avg = sum(all_preds[t][i] for t in range(len(self.trees))) / len(self.trees)
            averaged.append(avg)
        return averaged
