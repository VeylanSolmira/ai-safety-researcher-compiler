# Data Poisoning & Defense

## Learning Objectives

By the end of this topic, you should be able to:
- Understand the mechanisms and impact of data poisoning attacks on ML systems
- Implement detection algorithms for identifying poisoned training data
- Design robust training pipelines resistant to data poisoning
- Evaluate data integrity and detect anomalous patterns in datasets
- Build comprehensive defenses against both targeted and indiscriminate poisoning

## Introduction

Data poisoning represents one of the most insidious threats to machine learning systems, attacking the very foundation upon which models learn—their training data. Unlike adversarial examples that target models during inference, data poisoning corrupts the learning process itself, potentially embedding vulnerabilities that persist throughout a model's lifetime and affect all users.

The threat is particularly acute in modern ML pipelines that rely on large-scale data collection from diverse, often untrusted sources. From web-scraped datasets to crowd-sourced labels, from federated learning to continuous learning systems, each data source presents an opportunity for attackers to inject malicious samples. The consequences range from degraded model performance to backdoors that activate on specific triggers to systematic biases that affect particular groups.

This topic provides a comprehensive examination of data poisoning attacks and defenses, combining theoretical foundations with practical implementations and real-world case studies.

## Core Concepts

### Understanding Data Poisoning

**Definition**: Data poisoning involves injecting malicious samples into training data to compromise the resulting model's behavior, either degrading overall performance or creating specific vulnerabilities.

**Attack Taxonomy**:
```python
class DataPoisoningTaxonomy:
    """Comprehensive categorization of data poisoning attacks"""
    
    def __init__(self):
        self.attack_types = {
            'availability_attacks': {
                'goal': 'Degrade overall model performance',
                'methods': ['label_flipping', 'noise_injection', 'data_corruption'],
                'impact': 'Reduced accuracy across all inputs'
            },
            'integrity_attacks': {
                'goal': 'Create targeted misbehavior',
                'methods': ['backdoor_insertion', 'trigger_patterns', 'trojan_attacks'],
                'impact': 'Specific misclassifications on trigger inputs'
            },
            'privacy_attacks': {
                'goal': 'Extract information about training data',
                'methods': ['membership_inference', 'model_inversion', 'gradient_leakage'],
                'impact': 'Privacy violations'
            },
            'fairness_attacks': {
                'goal': 'Introduce or amplify biases',
                'methods': ['demographic_poisoning', 'subpopulation_attacks'],
                'impact': 'Discriminatory model behavior'
            }
        }
```

### Poisoning Attack Mechanisms

**1. Label Flipping Attacks**

```python
class LabelFlippingAttack:
    """Flip labels to degrade model performance"""
    
    def __init__(self, flip_rate=0.1, targeted=False):
        self.flip_rate = flip_rate
        self.targeted = targeted
        
    def poison_dataset(self, X, y, target_class=None):
        """Apply label flipping to dataset"""
        n_samples = len(y)
        n_poisoned = int(n_samples * self.flip_rate)
        
        if self.targeted and target_class is not None:
            # Targeted: flip specific class to another
            target_indices = np.where(y == target_class)[0]
            poison_indices = np.random.choice(
                target_indices, 
                min(n_poisoned, len(target_indices)), 
                replace=False
            )
            # Flip to a different class
            poisoned_labels = y.copy()
            for idx in poison_indices:
                poisoned_labels[idx] = (y[idx] + 1) % len(np.unique(y))
        else:
            # Indiscriminate: random flipping
            poison_indices = np.random.choice(n_samples, n_poisoned, replace=False)
            poisoned_labels = y.copy()
            for idx in poison_indices:
                # Random incorrect label
                wrong_labels = [l for l in np.unique(y) if l != y[idx]]
                poisoned_labels[idx] = np.random.choice(wrong_labels)
                
        return X, poisoned_labels, poison_indices
```

**2. Backdoor Attacks**

```python
class BackdoorAttack:
    """Insert backdoor triggers into training data"""
    
    def __init__(self, trigger_pattern, target_label, poison_rate=0.1):
        self.trigger_pattern = trigger_pattern
        self.target_label = target_label
        self.poison_rate = poison_rate
        
    def create_backdoor_sample(self, x, y):
        """Add trigger to a sample"""
        x_backdoor = x.copy()
        
        if len(x.shape) == 3:  # Image
            # Add trigger pattern (e.g., small patch)
            x_backdoor = self.add_trigger_to_image(x_backdoor)
        elif len(x.shape) == 1:  # Tabular/text features
            # Add trigger features
            x_backdoor = self.add_trigger_to_features(x_backdoor)
            
        return x_backdoor, self.target_label
        
    def add_trigger_to_image(self, image):
        """Add visual trigger pattern"""
        h, w = self.trigger_pattern.shape[:2]
        # Common pattern: small patch in corner
        image[-h:, -w:] = self.trigger_pattern
        return image
        
    def poison_dataset(self, X_train, y_train):
        """Create backdoored dataset"""
        n_samples = len(X_train)
        n_poison = int(n_samples * self.poison_rate)
        
        # Select samples to poison
        poison_indices = np.random.choice(n_samples, n_poison, replace=False)
        
        X_poisoned = X_train.copy()
        y_poisoned = y_train.copy()
        
        for idx in poison_indices:
            X_poisoned[idx], y_poisoned[idx] = self.create_backdoor_sample(
                X_train[idx], y_train[idx]
            )
            
        return X_poisoned, y_poisoned, poison_indices
```

**3. Clean-Label Poisoning**

```python
class CleanLabelPoisoning:
    """Poisoning without changing labels - more stealthy"""
    
    def __init__(self, target_model_architecture):
        self.target_architecture = target_model_architecture
        self.perturbation_budget = 0.1
        
    def generate_poison_perturbation(self, x, y, target_x):
        """Generate perturbation to make x similar to target in feature space"""
        
        # Initialize surrogate model
        surrogate = self.target_architecture()
        
        # Optimization loop to find perturbation
        x_poison = x.clone().requires_grad_(True)
        optimizer = torch.optim.Adam([x_poison], lr=0.01)
        
        for _ in range(100):
            # Extract features
            features_poison = surrogate.feature_extractor(x_poison)
            features_target = surrogate.feature_extractor(target_x)
            
            # Minimize feature distance
            loss = torch.nn.functional.mse_loss(features_poison, features_target)
            
            # Maintain visual similarity
            loss += 0.1 * torch.norm(x_poison - x)
            
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
            
            # Project to perturbation budget
            with torch.no_grad():
                perturbation = x_poison - x
                perturbation = torch.clamp(
                    perturbation, 
                    -self.perturbation_budget, 
                    self.perturbation_budget
                )
                x_poison.data = x + perturbation
                
        return x_poison.detach()
```

### Detection Mechanisms

**1. Statistical Detection**

```python
class StatisticalPoisonDetector:
    """Detect poisoned samples using statistical methods"""
    
    def __init__(self):
        self.detectors = {
            'activation_clustering': self.activation_clustering_detection,
            'gradient_analysis': self.gradient_based_detection,
            'influence_functions': self.influence_based_detection,
            'spectral_signatures': self.spectral_detection
        }
        
    def activation_clustering_detection(self, model, X, y):
        """Detect poisoned samples by analyzing activation patterns"""
        
        # Extract activations from penultimate layer
        activations = []
        model.eval()
        
        with torch.no_grad():
            for x in X:
                act = model.get_activations(x)
                activations.append(act.numpy())
                
        activations = np.array(activations)
        
        # Cluster activations
        from sklearn.cluster import KMeans
        kmeans = KMeans(n_clusters=len(np.unique(y)) + 1)  # +1 for poison cluster
        clusters = kmeans.fit_predict(activations)
        
        # Identify anomalous cluster
        cluster_sizes = [np.sum(clusters == i) for i in range(kmeans.n_clusters)]
        anomalous_cluster = np.argmin(cluster_sizes)
        
        # Samples in small cluster are suspicious
        suspicious_indices = np.where(clusters == anomalous_cluster)[0]
        
        return suspicious_indices
        
    def gradient_based_detection(self, model, X, y):
        """Detect based on gradient magnitude"""
        
        suspicious_indices = []
        gradient_norms = []
        
        for i, (x, label) in enumerate(zip(X, y)):
            x_tensor = torch.tensor(x, requires_grad=True)
            
            # Forward pass
            output = model(x_tensor)
            loss = F.cross_entropy(output.unsqueeze(0), torch.tensor([label]))
            
            # Compute gradient
            loss.backward()
            grad_norm = torch.norm(x_tensor.grad)
            gradient_norms.append(grad_norm.item())
            
        # Outliers in gradient norms are suspicious
        gradient_norms = np.array(gradient_norms)
        threshold = np.percentile(gradient_norms, 95)
        suspicious_indices = np.where(gradient_norms > threshold)[0]
        
        return suspicious_indices
```

**2. Certified Defense**

```python
class CertifiedPoisonDefense:
    """Provable defenses against data poisoning"""
    
    def __init__(self, contamination_rate=0.1):
        self.contamination_rate = contamination_rate
        
    def deep_partition_aggregation(self, X, y, n_models=10):
        """DPA: Certified defense via ensemble"""
        
        n_samples = len(X)
        partition_size = n_samples // n_models
        
        models = []
        for i in range(n_models):
            # Create partition
            start_idx = i * partition_size
            end_idx = (i + 1) * partition_size if i < n_models - 1 else n_samples
            
            X_partition = X[start_idx:end_idx]
            y_partition = y[start_idx:end_idx]
            
            # Train model on partition
            model = self.train_base_model(X_partition, y_partition)
            models.append(model)
            
        # Aggregate predictions with certified robustness
        def certified_predict(x):
            predictions = [model.predict(x) for model in models]
            
            # Majority vote with certification
            votes = np.bincount(predictions)
            majority_class = np.argmax(votes)
            majority_count = votes[majority_class]
            
            # Certified if enough models agree
            if majority_count >= n_models - 2 * int(n_models * self.contamination_rate):
                return majority_class, True  # Certified
            else:
                return majority_class, False  # Not certified
                
        return certified_predict
```

### Robust Training Methods

**1. Robust Aggregation**

```python
class RobustAggregation:
    """Robust aggregation methods for poisoned data"""
    
    def __init__(self):
        self.aggregators = {
            'trimmed_mean': self.trimmed_mean,
            'median': self.coordinate_median,
            'krum': self.krum,
            'bulyan': self.bulyan
        }
        
    def trimmed_mean(self, gradients, trim_ratio=0.1):
        """Compute trimmed mean of gradients"""
        n_trim = int(len(gradients) * trim_ratio)
        
        # Sort gradients by magnitude
        grad_norms = [torch.norm(g) for g in gradients]
        sorted_indices = np.argsort(grad_norms)
        
        # Trim largest and smallest
        kept_indices = sorted_indices[n_trim:-n_trim]
        kept_gradients = [gradients[i] for i in kept_indices]
        
        # Average remaining
        return torch.stack(kept_gradients).mean(dim=0)
        
    def krum(self, gradients, n_byzantine):
        """Krum: Byzantine-robust aggregation"""
        n_clients = len(gradients)
        n_selected = n_clients - n_byzantine - 2
        
        # Compute pairwise distances
        distances = torch.zeros((n_clients, n_clients))
        for i in range(n_clients):
            for j in range(n_clients):
                distances[i, j] = torch.norm(gradients[i] - gradients[j])
                
        # For each gradient, sum distances to n_selected nearest
        scores = []
        for i in range(n_clients):
            dists = distances[i].clone()
            dists[i] = float('inf')  # Exclude self
            nearest_dists = torch.topk(dists, n_selected, largest=False).values
            scores.append(nearest_dists.sum())
            
        # Select gradient with minimum score
        best_idx = torch.argmin(torch.tensor(scores))
        return gradients[best_idx]
```

**2. Data Sanitization**

```python
class DataSanitizer:
    """Clean potentially poisoned training data"""
    
    def __init__(self, base_model_class):
        self.base_model_class = base_model_class
        
    def iterative_trimming(self, X, y, trim_loss_ratio=0.1, n_rounds=5):
        """Iteratively remove high-loss samples"""
        
        X_clean, y_clean = X.copy(), y.copy()
        removed_indices = []
        
        for round in range(n_rounds):
            # Train model on current clean set
            model = self.base_model_class()
            model.fit(X_clean, y_clean)
            
            # Compute loss for each sample
            losses = []
            for i, (x, label) in enumerate(zip(X_clean, y_clean)):
                loss = model.compute_loss(x, label)
                losses.append((i, loss))
                
            # Sort by loss
            losses.sort(key=lambda x: x[1], reverse=True)
            
            # Remove top trim_loss_ratio samples
            n_remove = int(len(losses) * trim_loss_ratio)
            indices_to_remove = [idx for idx, _ in losses[:n_remove]]
            
            # Update clean set
            mask = np.ones(len(X_clean), dtype=bool)
            mask[indices_to_remove] = False
            
            X_clean = X_clean[mask]
            y_clean = y_clean[mask]
            
            # Track removed indices
            removed_indices.extend(indices_to_remove)
            
        return X_clean, y_clean, removed_indices
        
    def ensemble_filtering(self, X, y, n_models=5, agreement_threshold=0.8):
        """Filter using ensemble disagreement"""
        
        models = []
        n_samples = len(X)
        
        # Train ensemble with different subsets
        for i in range(n_models):
            # Random subset (with replacement)
            indices = np.random.choice(n_samples, n_samples, replace=True)
            X_subset = X[indices]
            y_subset = y[indices]
            
            model = self.base_model_class()
            model.fit(X_subset, y_subset)
            models.append(model)
            
        # Check agreement on each sample
        clean_mask = np.ones(n_samples, dtype=bool)
        
        for i, (x, label) in enumerate(zip(X, y)):
            predictions = [model.predict(x) for model in models]
            
            # Check if models agree with the label
            agreement = np.mean([pred == label for pred in predictions])
            
            if agreement < agreement_threshold:
                clean_mask[i] = False
                
        return X[clean_mask], y[clean_mask], np.where(~clean_mask)[0]
```

### Advanced Defense Strategies

**1. Differential Privacy Training**

```python
class DifferentiallyPrivateTraining:
    """Train with differential privacy guarantees"""
    
    def __init__(self, epsilon=1.0, delta=1e-5, clip_norm=1.0):
        self.epsilon = epsilon
        self.delta = delta
        self.clip_norm = clip_norm
        
    def dp_sgd(self, model, train_loader, epochs=10):
        """Differentially Private SGD"""
        
        optimizer = torch.optim.SGD(model.parameters(), lr=0.01)
        
        for epoch in range(epochs):
            for batch_x, batch_y in train_loader:
                # Compute per-sample gradients
                per_sample_grads = []
                
                for x, y in zip(batch_x, batch_y):
                    model.zero_grad()
                    loss = F.cross_entropy(model(x.unsqueeze(0)), y.unsqueeze(0))
                    loss.backward()
                    
                    # Clone gradients
                    grads = [p.grad.clone() for p in model.parameters()]
                    per_sample_grads.append(grads)
                    
                # Clip gradients
                for grads in per_sample_grads:
                    total_norm = torch.sqrt(
                        sum(torch.sum(g**2) for g in grads)
                    )
                    clip_factor = min(1, self.clip_norm / total_norm)
                    
                    for g in grads:
                        g *= clip_factor
                        
                # Average gradients
                avg_grads = []
                for i in range(len(model.parameters())):
                    avg_grad = torch.stack(
                        [grads[i] for grads in per_sample_grads]
                    ).mean(dim=0)
                    avg_grads.append(avg_grad)
                    
                # Add noise
                noise_scale = self.clip_norm * np.sqrt(2 * np.log(1.25 / self.delta)) / self.epsilon
                
                for param, avg_grad in zip(model.parameters(), avg_grads):
                    noise = torch.randn_like(avg_grad) * noise_scale
                    param.grad = avg_grad + noise
                    
                optimizer.step()
```

**2. Federated Learning Defenses**

```python
class FederatedPoisonDefense:
    """Defenses for federated learning scenarios"""
    
    def __init__(self, n_clients, byzantine_fraction=0.2):
        self.n_clients = n_clients
        self.byzantine_fraction = byzantine_fraction
        
    def secure_aggregation(self, client_updates):
        """Secure aggregation with anomaly detection"""
        
        # Compute update statistics
        update_norms = [torch.norm(torch.cat([p.flatten() for p in update])) 
                        for update in client_updates]
        
        # Detect anomalies using robust statistics
        median_norm = np.median(update_norms)
        mad = np.median(np.abs(update_norms - median_norm))
        threshold = median_norm + 3 * mad
        
        # Filter suspicious updates
        clean_updates = []
        for i, (update, norm) in enumerate(zip(client_updates, update_norms)):
            if norm <= threshold:
                clean_updates.append(update)
            else:
                print(f"Filtered suspicious update from client {i}")
                
        # Robust aggregation of clean updates
        return self.robust_mean(clean_updates)
        
    def robust_mean(self, updates):
        """Compute robust mean of updates"""
        
        if len(updates) == 0:
            return None
            
        # Geometric median
        return self.geometric_median(updates)
        
    def geometric_median(self, points, eps=1e-5, max_iter=100):
        """Compute geometric median of points"""
        
        # Initialize with coordinate-wise median
        median = torch.stack([
            torch.median(torch.stack([p[i] for p in points]), dim=0).values
            for i in range(len(points[0]))
        ])
        
        for _ in range(max_iter):
            weights = []
            for p in points:
                dist = torch.norm(median - p)
                weights.append(1 / (dist + eps))
                
            weights = torch.tensor(weights)
            weights = weights / weights.sum()
            
            new_median = sum(w * p for w, p in zip(weights, points))
            
            if torch.norm(new_median - median) < eps:
                break
                
            median = new_median
            
        return median
```

## Practical Applications

### Building a Poison-Resistant Training Pipeline

```python
class PoisonResistantPipeline:
    """Complete pipeline for training with potentially poisoned data"""
    
    def __init__(self, model_class, contamination_estimate=0.1):
        self.model_class = model_class
        self.contamination = contamination_estimate
        self.detector = StatisticalPoisonDetector()
        self.sanitizer = DataSanitizer(model_class)
        
    def train_robust_model(self, X_train, y_train, X_val, y_val):
        """Train model with comprehensive poison defenses"""
        
        # Step 1: Initial filtering
        print("Step 1: Initial data filtering...")
        X_filtered, y_filtered, removed_initial = self.sanitizer.ensemble_filtering(
            X_train, y_train
        )
        print(f"Removed {len(removed_initial)} suspicious samples")
        
        # Step 2: Train preliminary model for detection
        print("Step 2: Training preliminary model...")
        prelim_model = self.model_class()
        prelim_model.fit(X_filtered, y_filtered)
        
        # Step 3: Activation-based detection
        print("Step 3: Activation-based poison detection...")
        suspicious_indices = self.detector.activation_clustering_detection(
            prelim_model, X_filtered, y_filtered
        )
        
        # Remove detected samples
        clean_mask = np.ones(len(X_filtered), dtype=bool)
        clean_mask[suspicious_indices] = False
        X_clean = X_filtered[clean_mask]
        y_clean = y_filtered[clean_mask]
        
        print(f"Removed {len(suspicious_indices)} additional suspicious samples")
        
        # Step 4: Robust training
        print("Step 4: Robust model training...")
        final_model = self.train_with_robust_loss(X_clean, y_clean)
        
        # Step 5: Validation and backdoor scanning
        print("Step 5: Validation and backdoor scanning...")
        val_acc = self.evaluate_model(final_model, X_val, y_val)
        backdoor_found = self.scan_for_backdoors(final_model, X_val)
        
        if backdoor_found:
            print("WARNING: Potential backdoor detected!")
            final_model = self.apply_backdoor_mitigation(final_model, X_clean, y_clean)
            
        return final_model, {
            'samples_removed': len(removed_initial) + len(suspicious_indices),
            'final_samples': len(X_clean),
            'validation_accuracy': val_acc,
            'backdoor_detected': backdoor_found
        }
```

### Real-World Case Study: Poisoning in Medical AI

```python
class MedicalAIPoisonDefense:
    """Defending medical AI against data poisoning"""
    
    def __init__(self):
        self.trusted_sources = ['hospital_a', 'hospital_b']
        self.untrusted_threshold = 0.3
        
    def validate_medical_dataset(self, dataset, source_labels):
        """Validate medical imaging dataset"""
        
        # Separate by source trust level
        trusted_data = []
        untrusted_data = []
        
        for data, source in zip(dataset, source_labels):
            if source in self.trusted_sources:
                trusted_data.append(data)
            else:
                untrusted_data.append(data)
                
        # Use trusted data to validate untrusted
        validator_model = self.train_on_trusted(trusted_data)
        
        # Check each untrusted sample
        clean_untrusted = []
        poisoned_candidates = []
        
        for sample in untrusted_data:
            if self.is_consistent_with_trusted(sample, validator_model):
                clean_untrusted.append(sample)
            else:
                poisoned_candidates.append(sample)
                
        # Manual review protocol for candidates
        reviewed_samples = self.expert_review_protocol(poisoned_candidates)
        
        # Combine all clean data
        final_dataset = trusted_data + clean_untrusted + reviewed_samples
        
        return final_dataset
```

### Continuous Learning Defense

```python
class ContinuousLearningDefense:
    """Defend against poisoning in online/continuous learning"""
    
    def __init__(self, window_size=1000, drift_threshold=0.1):
        self.window_size = window_size
        self.drift_threshold = drift_threshold
        self.historical_stats = []
        
    def update_with_new_data(self, model, new_data, new_labels):
        """Safely update model with new data"""
        
        # Compute statistics on new data
        new_stats = self.compute_data_statistics(new_data, new_labels)
        
        # Check for distribution shift
        if self.detect_distribution_shift(new_stats):
            print("Distribution shift detected - applying extra scrutiny")
            new_data, new_labels = self.enhanced_filtering(
                new_data, new_labels, model
            )
            
        # Incremental validation
        if not self.validate_incremental_update(model, new_data, new_labels):
            print("Update would degrade model - rejecting")
            return model
            
        # Safe update with rollback capability
        model_backup = self.backup_model(model)
        
        try:
            updated_model = self.incremental_update(model, new_data, new_labels)
            
            # Post-update validation
            if self.post_update_validation(updated_model):
                self.historical_stats.append(new_stats)
                return updated_model
            else:
                print("Post-update validation failed - rolling back")
                return model_backup
                
        except Exception as e:
            print(f"Update failed: {e} - rolling back")
            return model_backup
```

## Evaluation and Monitoring

### Comprehensive Poisoning Defense Evaluation

```python
class PoisonDefenseEvaluator:
    """Evaluate effectiveness of poisoning defenses"""
    
    def __init__(self):
        self.attack_suite = {
            'label_flipping': LabelFlippingAttack(),
            'backdoor': BackdoorAttack(),
            'clean_label': CleanLabelPoisoning(),
            'gradient_poisoning': GradientPoisoning()
        }
        
    def evaluate_defense(self, defense_method, clean_data, clean_labels):
        """Comprehensive evaluation against multiple attacks"""
        
        results = {}
        
        for attack_name, attacker in self.attack_suite.items():
            print(f"\nEvaluating against {attack_name}...")
            
            # Generate poisoned dataset
            X_poisoned, y_poisoned, poison_indices = attacker.poison_dataset(
                clean_data, clean_labels
            )
            
            # Apply defense
            X_defended, y_defended, detected_indices = defense_method(
                X_poisoned, y_poisoned
            )
            
            # Compute metrics
            metrics = {
                'true_positive_rate': len(
                    set(detected_indices) & set(poison_indices)
                ) / len(poison_indices),
                'false_positive_rate': len(
                    set(detected_indices) - set(poison_indices)
                ) / (len(clean_data) - len(poison_indices)),
                'data_retained': len(X_defended) / len(clean_data),
                'attack_success_rate': self.measure_attack_success(
                    X_defended, y_defended, attacker
                )
            }
            
            results[attack_name] = metrics
            
        return results
```

## Common Pitfalls

### 1. Assuming Clean Validation Data

**Mistake**: Using potentially poisoned data for validation
**Problem**: Poisoned validation data can hide attack success
**Solution**: Maintain trusted, isolated validation sets

### 2. Over-filtering

**Mistake**: Removing too much data in pursuit of safety
**Problem**: Significant performance degradation
**Solution**: Balance security with data efficiency

### 3. Single Defense Strategy

**Mistake**: Relying on one detection or defense method
**Problem**: Adaptive attackers can bypass single defenses
**Solution**: Layer multiple complementary defenses

### 4. Ignoring Stealthy Attacks

**Mistake**: Only defending against obvious poisoning
**Problem**: Clean-label and subtle attacks go undetected
**Solution**: Use deep feature analysis and behavioral monitoring

### 5. Static Defense

**Mistake**: Not updating defenses as attacks evolve
**Problem**: New attack variants bypass old defenses
**Solution**: Continuous monitoring and defense updates

## Hands-on Exercise

Build a robust training system:

1. **Implement poison detection**:
   - Statistical outlier detection
   - Activation clustering
   - Gradient analysis
   - Influence functions

2. **Create data sanitization pipeline**:
   - Ensemble filtering
   - Iterative trimming
   - Cross-validation cleaning
   - Trusted subset bootstrapping

3. **Build robust training**:
   - Implement TRADES-style training
   - Add differential privacy
   - Use certified aggregation
   - Create rollback mechanisms

4. **Test against attacks**:
   - Label flipping
   - Backdoor insertion
   - Clean-label poisoning
   - Adaptive attacks

5. **Deploy with monitoring**:
   - Continuous validation
   - Distribution shift detection
   - Performance tracking
   - Automated alerts

## Further Reading

- "Certified Defenses for Data Poisoning Attacks" - Steinhardt et al. 2017
- "Deep Partition Aggregation" - Levine & Feizi 2021
- "Spectral Signatures in Backdoor Attacks" - Tran et al. 2018
- "Dataset Security for Machine Learning" - USENIX Security 2021
- "Byzantine-Robust Distributed Learning" - Blanchard et al. 2017
- "On the Effectiveness of Mitigating Data Poisoning Attacks" - Peri et al. 2020

## Connections

- **Related Topics**: [Backdoor Attacks](#backdoor-attacks), [Federated Learning](#federated-learning), [Robust Statistics](#robust-statistics)
- **Prerequisites**: [Machine Learning Basics](#ml-fundamentals), [Security Fundamentals](#security-basics)
- **Next Steps**: [Secure ML Pipelines](#secure-pipelines), [Privacy-Preserving ML](#privacy-ml)