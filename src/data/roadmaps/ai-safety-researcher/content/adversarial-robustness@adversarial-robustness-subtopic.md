# Adversarial Robustness Techniques

## Learning Objectives

By the end of this topic, you should be able to:
- Understand the theory and practice of adversarial examples in AI systems
- Implement state-of-the-art adversarial training techniques
- Design and evaluate robust model architectures
- Apply certified defense mechanisms with provable guarantees
- Build comprehensive robustness evaluation frameworks

## Introduction

Adversarial robustness represents one of the most fundamental challenges in deploying AI systems safely. The discovery that imperceptible perturbations to inputs can cause dramatic misclassifications revealed a critical vulnerability in neural networks that extends far beyond academic curiosity—it poses real threats to AI systems in security-critical applications.

The field has evolved from initial observations of gradient-based attacks on image classifiers to a sophisticated discipline encompassing certified defenses, robust optimization, and theoretical frameworks for understanding why neural networks are vulnerable. As AI systems are deployed in autonomous vehicles, medical diagnosis, and financial systems, ensuring robustness against adversarial manipulation becomes not just a technical challenge but an ethical imperative.

This topic provides a comprehensive exploration of adversarial robustness, from fundamental concepts to cutting-edge defense mechanisms, with practical implementations and real-world applications.

## Core Concepts

### Understanding Adversarial Examples

**Definition**: Adversarial examples are inputs crafted to cause a machine learning model to make incorrect predictions, often through imperceptible modifications to legitimate inputs.

**Mathematical Foundation**:
```
Given a model f: X → Y and an input x with true label y,
an adversarial example x' satisfies:
1. ||x' - x|| ≤ ε (bounded perturbation)
2. f(x') ≠ y (misclassification)
3. x' appears identical to x to human perception
```

### Types of Adversarial Attacks

```python
class AdversarialAttackTaxonomy:
    """Comprehensive taxonomy of adversarial attacks"""
    
    def __init__(self):
        self.attack_categories = {
            'perturbation_type': {
                'lp_norm': ['l_inf', 'l_2', 'l_1', 'l_0'],
                'semantic': ['rotation', 'translation', 'color_shift'],
                'physical': ['stickers', 'patches', 'lighting']
            },
            'knowledge_level': {
                'white_box': 'Full model access',
                'black_box': 'Query access only',
                'grey_box': 'Partial knowledge'
            },
            'targeting': {
                'untargeted': 'Any misclassification',
                'targeted': 'Specific misclassification'
            },
            'domain': {
                'image': ['pixel_perturbation', 'spatial_transform'],
                'text': ['character_swap', 'word_substitution'],
                'audio': ['noise_injection', 'frequency_manipulation']
            }
        }
```

### Fundamental Attack Algorithms

**1. Fast Gradient Sign Method (FGSM)**

```python
def fgsm_attack(model, x, y, epsilon):
    """
    Fast Gradient Sign Method
    Goodfellow et al., 2014
    """
    x.requires_grad = True
    
    # Forward pass
    output = model(x)
    loss = F.cross_entropy(output, y)
    
    # Backward pass
    model.zero_grad()
    loss.backward()
    
    # Create adversarial example
    x_adv = x + epsilon * x.grad.sign()
    x_adv = torch.clamp(x_adv, 0, 1)  # Ensure valid pixel range
    
    return x_adv
```

**2. Projected Gradient Descent (PGD)**

```python
class PGDAttack:
    """
    Projected Gradient Descent Attack
    Madry et al., 2017
    """
    
    def __init__(self, model, eps, alpha, steps, random_start=True):
        self.model = model
        self.eps = eps
        self.alpha = alpha
        self.steps = steps
        self.random_start = random_start
        
    def perturb(self, x, y):
        x_adv = x.clone().detach()
        
        if self.random_start:
            # Random initialization within epsilon ball
            x_adv = x_adv + torch.empty_like(x_adv).uniform_(-self.eps, self.eps)
            x_adv = torch.clamp(x_adv, 0, 1)
            
        for _ in range(self.steps):
            x_adv.requires_grad = True
            
            # Compute loss
            output = self.model(x_adv)
            loss = F.cross_entropy(output, y)
            
            # Compute gradients
            grad = torch.autograd.grad(loss, x_adv, 
                                      retain_graph=False, 
                                      create_graph=False)[0]
            
            # Update adversarial example
            x_adv = x_adv.detach() + self.alpha * grad.sign()
            
            # Project back to epsilon ball
            delta = torch.clamp(x_adv - x, min=-self.eps, max=self.eps)
            x_adv = torch.clamp(x + delta, 0, 1)
            
        return x_adv
```

**3. C&W Attack**

```python
class CarliniWagnerAttack:
    """
    Carlini & Wagner Attack
    Carlini & Wagner, 2017
    """
    
    def __init__(self, model, c=1e-4, kappa=0, steps=1000, lr=0.01):
        self.model = model
        self.c = c
        self.kappa = kappa
        self.steps = steps
        self.lr = lr
        
    def perturb(self, x, y_target):
        # Use tanh to ensure valid pixel range
        w = torch.zeros_like(x, requires_grad=True)
        optimizer = torch.optim.Adam([w], lr=self.lr)
        
        best_adv = x.clone()
        best_dist = float('inf')
        
        for step in range(self.steps):
            # Convert to image space
            x_adv = 0.5 * (torch.tanh(w) + 1)
            
            # Compute logits
            logits = self.model(x_adv)
            
            # Compute f(x) as defined in C&W
            target_logit = logits[0, y_target]
            max_other = torch.max(
                torch.cat([logits[0, :y_target], logits[0, y_target+1:]])
            )
            f_x = torch.clamp(target_logit - max_other + self.kappa, min=0)
            
            # Compute L2 distance
            dist = torch.norm(x_adv - x)
            
            # Combined loss
            loss = dist + self.c * f_x
            
            # Update
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
            
            # Track best adversarial example
            if dist < best_dist and f_x == 0:
                best_adv = x_adv.clone()
                best_dist = dist
                
        return best_adv
```

### Defense Mechanisms

**1. Adversarial Training**

```python
class AdversarialTraining:
    """
    Standard adversarial training framework
    """
    
    def __init__(self, model, attack, optimizer):
        self.model = model
        self.attack = attack
        self.optimizer = optimizer
        
    def train_epoch(self, train_loader):
        self.model.train()
        total_loss = 0
        correct = 0
        total = 0
        
        for batch_idx, (data, target) in enumerate(train_loader):
            # Generate adversarial examples
            data_adv = self.attack.perturb(data, target)
            
            # Train on adversarial examples
            self.optimizer.zero_grad()
            output = self.model(data_adv)
            loss = F.cross_entropy(output, target)
            
            loss.backward()
            self.optimizer.step()
            
            # Track metrics
            total_loss += loss.item()
            pred = output.argmax(dim=1, keepdim=True)
            correct += pred.eq(target.view_as(pred)).sum().item()
            total += target.size(0)
            
        return total_loss / len(train_loader), correct / total
```

**2. TRADES (TRadeoff-inspired Adversarial Defense via Surrogate-loss minimization)**

```python
class TRADES:
    """
    Zhang et al., 2019
    """
    
    def __init__(self, model, beta=6.0):
        self.model = model
        self.beta = beta
        
    def trades_loss(self, x, y, optimizer, step_size=0.003, epsilon=0.031, 
                    perturb_steps=10):
        # Natural loss
        self.model.train()
        output = self.model(x)
        loss_natural = F.cross_entropy(output, y)
        
        # Generate adversarial examples
        x_adv = x.detach() + 0.001 * torch.randn(x.shape).to(x.device)
        
        for _ in range(perturb_steps):
            x_adv.requires_grad_()
            with torch.enable_grad():
                loss_kl = F.kl_div(
                    F.log_softmax(self.model(x_adv), dim=1),
                    F.softmax(self.model(x), dim=1),
                    reduction='batchmean'
                )
            grad = torch.autograd.grad(loss_kl, [x_adv])[0]
            x_adv = x_adv.detach() + step_size * torch.sign(grad.detach())
            x_adv = torch.min(torch.max(x_adv, x - epsilon), x + epsilon)
            x_adv = torch.clamp(x_adv, 0.0, 1.0)
            
        # Robust loss
        x_adv = Variable(x_adv, requires_grad=False)
        output_adv = self.model(x_adv)
        loss_robust = F.kl_div(
            F.log_softmax(output_adv, dim=1),
            F.softmax(output, dim=1),
            reduction='batchmean'
        )
        
        # Combined loss
        loss = loss_natural + self.beta * loss_robust
        
        return loss
```

**3. Certified Defenses**

```python
class CertifiedDefense:
    """
    Randomized smoothing for certified robustness
    Cohen et al., 2019
    """
    
    def __init__(self, base_classifier, sigma=0.25, n0=100, n=1000, alpha=0.001):
        self.base_classifier = base_classifier
        self.sigma = sigma
        self.n0 = n0  # Samples for prediction
        self.n = n    # Samples for certification
        self.alpha = alpha  # Failure probability
        
    def predict(self, x):
        """Make a prediction with certification"""
        self.base_classifier.eval()
        
        # Sample n0 predictions
        counts = self._sample_noise(x, self.n0)
        
        # Top class
        cAHat = counts.argmax().item()
        
        # Certification
        counts_cert = self._sample_noise(x, self.n)
        nA = counts_cert[cAHat].item()
        
        # Statistical test
        pABar = self._lower_confidence_bound(nA, self.n, self.alpha)
        
        if pABar > 0.5:
            # Certified radius
            radius = self.sigma * norm.ppf(pABar)
            return cAHat, radius
        else:
            # Cannot certify
            return -1, 0.0
            
    def _sample_noise(self, x, n):
        with torch.no_grad():
            counts = torch.zeros(self.num_classes, dtype=int)
            
            for _ in range(n):
                noise = torch.randn_like(x) * self.sigma
                predictions = self.base_classifier(x + noise).argmax(1)
                counts += self._count_arr(predictions, self.num_classes)
                
        return counts
        
    def _lower_confidence_bound(self, NA, N, alpha):
        """Clopper-Pearson confidence interval"""
        return proportion_confint(NA, N, alpha=2*alpha, method="beta")[0]
```

### Advanced Defense Strategies

**1. Ensemble Adversarial Training**

```python
class EnsembleAdversarialTraining:
    """
    Train with adversarial examples from multiple models
    Tramèr et al., 2017
    """
    
    def __init__(self, models, alpha=0.5):
        self.models = models
        self.alpha = alpha  # Weight for ensemble examples
        
    def generate_ensemble_adversarial(self, x, y, epsilon):
        adv_examples = []
        
        for model in self.models:
            # Generate adversarial examples from each model
            attack = PGDAttack(model, eps=epsilon, alpha=epsilon/4, steps=10)
            x_adv = attack.perturb(x, y)
            adv_examples.append(x_adv)
            
        # Combine adversarial examples
        ensemble_adv = torch.stack(adv_examples).mean(0)
        
        # Project back to epsilon ball
        delta = torch.clamp(ensemble_adv - x, -epsilon, epsilon)
        ensemble_adv = torch.clamp(x + delta, 0, 1)
        
        return ensemble_adv
```

**2. Feature Denoising**

```python
class FeatureDenoiser(nn.Module):
    """
    Denoise intermediate features for robustness
    Xie et al., 2019
    """
    
    def __init__(self, in_channels):
        super().__init__()
        self.denoiser = nn.Sequential(
            nn.Conv2d(in_channels, in_channels, 1),
            nn.BatchNorm2d(in_channels),
            nn.ReLU(),
            nn.Conv2d(in_channels, in_channels, 1),
            nn.BatchNorm2d(in_channels)
        )
        
    def forward(self, x):
        # Denoise features
        identity = x
        out = self.denoiser(x)
        
        # Soft thresholding
        threshold = 0.1
        out = torch.sign(out) * torch.relu(torch.abs(out) - threshold)
        
        return identity + out
```

## Practical Applications

### Building a Robust Image Classifier

```python
class RobustImageClassifier:
    """
    Complete robust image classification system
    """
    
    def __init__(self, model_architecture, num_classes):
        self.model = model_architecture(num_classes=num_classes)
        self.num_classes = num_classes
        self.training_config = {
            'epochs': 100,
            'epsilon': 8/255,
            'step_size': 2/255,
            'num_steps': 10,
            'trades_beta': 6.0
        }
        
    def train_robust_model(self, train_loader, val_loader):
        optimizer = torch.optim.SGD(
            self.model.parameters(), 
            lr=0.1, 
            momentum=0.9, 
            weight_decay=5e-4
        )
        scheduler = torch.optim.lr_scheduler.MultiStepLR(
            optimizer, 
            milestones=[75, 90], 
            gamma=0.1
        )
        
        best_robust_acc = 0
        
        for epoch in range(self.training_config['epochs']):
            # Adversarial training
            self.adversarial_train_epoch(train_loader, optimizer)
            
            # Evaluation
            natural_acc = self.evaluate(val_loader, adversarial=False)
            robust_acc = self.evaluate(val_loader, adversarial=True)
            
            print(f'Epoch {epoch}: Natural: {natural_acc:.2f}%, '
                  f'Robust: {robust_acc:.2f}%')
            
            # Save best model
            if robust_acc > best_robust_acc:
                best_robust_acc = robust_acc
                torch.save(self.model.state_dict(), 'best_robust_model.pth')
                
            scheduler.step()
            
    def adversarial_train_epoch(self, loader, optimizer):
        self.model.train()
        
        for batch_idx, (data, target) in enumerate(loader):
            # Generate adversarial examples
            data_adv = self.generate_adversarial_batch(data, target)
            
            # Mix clean and adversarial
            if np.random.rand() > 0.5:
                inputs = data_adv
            else:
                inputs = data
                
            # Forward and backward
            optimizer.zero_grad()
            output = self.model(inputs)
            loss = F.cross_entropy(output, target)
            loss.backward()
            optimizer.step()
```

### Multi-Domain Robustness

```python
class MultiDomainRobustness:
    """
    Robustness across different input domains
    """
    
    def __init__(self):
        self.domain_attacks = {
            'image': ImageAdversarialAttacks(),
            'text': TextAdversarialAttacks(),
            'audio': AudioAdversarialAttacks(),
            'tabular': TabularAdversarialAttacks()
        }
        
    def evaluate_cross_domain_robustness(self, model, test_data):
        results = {}
        
        for domain, attack_suite in self.domain_attacks.items():
            if domain not in test_data:
                continue
                
            domain_results = {
                'natural_accuracy': self.evaluate_natural(
                    model, test_data[domain]
                ),
                'robustness_results': {}
            }
            
            # Test against various attacks
            for attack_name, attack in attack_suite.get_attacks().items():
                robust_acc = self.evaluate_against_attack(
                    model, test_data[domain], attack
                )
                domain_results['robustness_results'][attack_name] = robust_acc
                
            results[domain] = domain_results
            
        return results
```

### Real-World Deployment

```python
class RobustDeploymentPipeline:
    """
    Production-ready robust AI deployment
    """
    
    def __init__(self, model, defense_config):
        self.model = model
        self.preprocessor = RobustPreprocessor()
        self.detector = AdversarialDetector()
        self.denoiser = InputDenoiser()
        self.monitor = RobustnessMonitor()
        
    def process_request(self, input_data):
        # Input validation
        if not self.validate_input(input_data):
            return self.invalid_input_response()
            
        # Adversarial detection
        adv_score = self.detector.detect(input_data)
        if adv_score > self.detection_threshold:
            self.log_potential_attack(input_data, adv_score)
            input_data = self.denoiser.denoise(input_data)
            
        # Robust preprocessing
        processed = self.preprocessor.process(input_data)
        
        # Model inference with uncertainty
        with torch.no_grad():
            output = self.model(processed)
            uncertainty = self.estimate_uncertainty(output)
            
        # Post-processing and validation
        if uncertainty > self.uncertainty_threshold:
            return self.high_uncertainty_response(output, uncertainty)
            
        # Monitor robustness metrics
        self.monitor.log_inference(input_data, output, adv_score, uncertainty)
        
        return self.format_response(output)
```

## Evaluation and Metrics

### Comprehensive Robustness Evaluation

```python
class RobustnessEvaluator:
    """
    Comprehensive evaluation suite for adversarial robustness
    """
    
    def __init__(self, model, dataset):
        self.model = model
        self.dataset = dataset
        self.attacks = self.initialize_attack_suite()
        
    def full_evaluation(self):
        results = {
            'natural_accuracy': self.evaluate_natural(),
            'robustness_curve': self.compute_robustness_curve(),
            'certified_accuracy': self.evaluate_certified(),
            'attack_specific': self.evaluate_all_attacks(),
            'transferability': self.evaluate_transferability()
        }
        
        return results
        
    def compute_robustness_curve(self):
        """Accuracy vs perturbation budget curve"""
        epsilons = np.linspace(0, 16/255, 17)
        accuracies = []
        
        for eps in epsilons:
            attack = PGDAttack(self.model, eps=eps, alpha=eps/4, steps=20)
            acc = self.evaluate_against_attack(attack)
            accuracies.append(acc)
            
        return {'epsilons': epsilons.tolist(), 'accuracies': accuracies}
        
    def evaluate_certified(self):
        """Evaluate certified robustness"""
        smoother = CertifiedDefense(self.model, sigma=0.25)
        certified_accurate = 0
        certified_robust = 0
        
        for x, y in self.dataset:
            pred, radius = smoother.predict(x)
            
            if pred == y:
                certified_accurate += 1
                if radius > 0.5:  # L2 radius threshold
                    certified_robust += 1
                    
        return {
            'certified_accuracy': certified_accurate / len(self.dataset),
            'certified_robust_accuracy': certified_robust / len(self.dataset)
        }
```

## Common Pitfalls

### 1. Gradient Masking

**Mistake**: Defenses that obscure gradients rather than improve robustness
**Detection**: Check if black-box attacks succeed where white-box fail
**Solution**: Use gradient-free attacks for evaluation

### 2. Weak Attack Evaluation

**Mistake**: Testing only against FGSM or weak attacks
**Solution**: Evaluate against strong adaptive attacks

### 3. Distribution Shift

**Mistake**: Training on one type of adversarial examples
**Solution**: Diverse adversarial training with multiple attack types

### 4. Robustness-Accuracy Tradeoff

**Mistake**: Ignoring significant accuracy drops
**Solution**: Carefully balance robustness and natural accuracy

### 5. Computational Overhead

**Mistake**: Defenses too expensive for deployment
**Solution**: Optimize for inference efficiency

## Hands-on Exercise

Build a robust model for a critical application:

1. **Implement basic attacks**:
   - FGSM, PGD, and C&W attacks
   - Evaluate on standard dataset

2. **Train robust model**:
   - Standard adversarial training
   - TRADES objective
   - Track natural vs robust accuracy

3. **Advanced defenses**:
   - Implement randomized smoothing
   - Add input preprocessing
   - Ensemble methods

4. **Comprehensive evaluation**:
   - Multiple attack types
   - Various perturbation budgets
   - Certified accuracy
   - Computational efficiency

5. **Deploy with monitoring**:
   - Real-time robustness metrics
   - Adversarial detection
   - Graceful degradation

## Further Reading

- "Towards Deep Learning Models Resistant to Adversarial Attacks" - Madry et al. 2017
- "Certified Adversarial Robustness via Randomized Smoothing" - Cohen et al. 2019
- "Theoretically Principled Trade-off between Robustness and Accuracy" - Zhang et al. 2019
- "Adversarial Examples Are Not Bugs, They Are Features" - Ilyas et al. 2019
- "Reliable evaluation of adversarial robustness with an ensemble of diverse parameter-free attacks" - Croce & Hein 2020
- "RobustBench: A standardized adversarial robustness benchmark" - Croce et al. 2021

## Connections

- **Related Topics**: [AI Security](#ai-systems-security), [Red Teaming](#red-teaming), [Trustworthy AI](#trustworthy-ai)
- **Prerequisites**: [Deep Learning](#neural-networks), [Optimization](#calculus-optimization)
- **Next Steps**: [Certified Defenses](#certified-defenses), [Robust ML Theory](#robust-ml-theory)