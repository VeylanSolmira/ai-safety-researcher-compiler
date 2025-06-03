# Grey Box Testing Methods

## Learning Objectives

By the end of this topic, you should be able to:
- Master grey box testing techniques that combine white and black box approaches
- Design test strategies leveraging partial model knowledge
- Implement efficient testing with limited internal access
- Build hybrid testing frameworks for real-world AI systems
- Optimize testing strategies based on available model information

## Introduction

Grey box testing represents the practical reality of testing most AI systems—situations where we have some, but not complete, access to model internals. This hybrid approach combines the realism of black box testing with the analytical power of white box methods. In practice, grey box scenarios arise frequently: when we have access to model architecture but not weights, when we can observe some internal states but not gradients, or when we have documentation but not implementation details.

The power of grey box testing lies in its ability to leverage whatever information is available to design more efficient and effective tests than pure black box approaches, while remaining applicable to systems where full white box access is impossible or impractical. This middle ground often represents the optimal balance between test effectiveness and real-world constraints.

This topic explores the spectrum of grey box testing techniques, from methods that use minimal internal information to approaches that leverage substantial architectural knowledge, with emphasis on adapting strategies to the level of access available.

## Core Concepts

### The Grey Box Spectrum

**Levels of Model Access**:
```python
class GreyBoxAccessLevels:
    """Different levels of partial model access"""
    
    def __init__(self):
        self.access_spectrum = {
            'architecture_only': {
                'info': 'Model architecture and layer types',
                'no_access': 'Weights, gradients, activations',
                'techniques': ['Architecture-aware fuzzing', 'Layer-targeted testing']
            },
            'output_logits': {
                'info': 'Full output probabilities, not just predictions',
                'no_access': 'Internal states, gradients',
                'techniques': ['Confidence-based testing', 'Logit analysis']
            },
            'partial_gradients': {
                'info': 'Gradients w.r.t inputs only',
                'no_access': 'Internal gradients, weights',
                'techniques': ['Input gradient attacks', 'Sensitivity analysis']
            },
            'layer_outputs': {
                'info': 'Intermediate layer outputs',
                'no_access': 'Weights, gradients',
                'techniques': ['Layer-wise testing', 'Feature analysis']
            },
            'metadata_rich': {
                'info': 'Training details, dataset info, hyperparameters',
                'no_access': 'Model internals',
                'techniques': ['Training-aware testing', 'Distribution testing']
            }
        }
```

### Architecture-Aware Testing

**1. Layer-Specific Test Generation**
```python
class ArchitectureAwareTesting:
    """Testing strategies based on known architecture"""
    
    def __init__(self, architecture_info):
        self.architecture = architecture_info
        self.layer_types = self.extract_layer_types()
        self.test_strategies = self.build_layer_strategies()
        
    def extract_layer_types(self):
        """Extract information about model layers"""
        layer_info = []
        
        for layer in self.architecture['layers']:
            layer_info.append({
                'name': layer['name'],
                'type': layer['type'],
                'params': layer.get('params', {}),
                'input_shape': layer.get('input_shape'),
                'output_shape': layer.get('output_shape')
            })
            
        return layer_info
        
    def build_layer_strategies(self):
        """Build test strategies based on layer types"""
        strategies = {}
        
        for layer in self.layer_types:
            if layer['type'] == 'Conv2D':
                strategies[layer['name']] = ConvolutionTester(layer['params'])
            elif layer['type'] == 'Attention':
                strategies[layer['name']] = AttentionTester(layer['params'])
            elif layer['type'] == 'BatchNorm':
                strategies[layer['name']] = BatchNormTester(layer['params'])
            elif layer['type'] == 'Dropout':
                strategies[layer['name']] = DropoutTester(layer['params'])
                
        return strategies
        
    def generate_targeted_tests(self, base_input):
        """Generate tests targeting specific architectural components"""
        test_suite = []
        
        # Test convolution layers with frequency patterns
        if any(l['type'] == 'Conv2D' for l in self.layer_types):
            test_suite.extend(self.generate_frequency_tests(base_input))
            
        # Test attention with position perturbations
        if any(l['type'] == 'Attention' for l in self.layer_types):
            test_suite.extend(self.generate_attention_tests(base_input))
            
        # Test normalization with distribution shifts
        if any(l['type'] in ['BatchNorm', 'LayerNorm'] for l in self.layer_types):
            test_suite.extend(self.generate_normalization_tests(base_input))
            
        return test_suite
        
    def generate_frequency_tests(self, base_input):
        """Generate tests for convolutional layers"""
        tests = []
        
        # Different frequency components
        for freq in [0.1, 0.5, 1.0, 2.0, 5.0]:
            # Add sinusoidal noise at different frequencies
            noise = self.generate_frequency_noise(base_input.shape, freq)
            tests.append({
                'input': base_input + 0.1 * noise,
                'test_type': 'frequency',
                'frequency': freq,
                'targets': 'conv_layers'
            })
            
        return tests
```

**2. Model-Specific Vulnerability Testing**
```python
class ModelSpecificVulnerabilities:
    """Test for vulnerabilities specific to known architectures"""
    
    def __init__(self, model_type, model_interface):
        self.model_type = model_type
        self.model = model_interface
        self.vulnerabilities = self.load_known_vulnerabilities()
        
    def load_known_vulnerabilities(self):
        """Load known vulnerabilities for specific model types"""
        vuln_database = {
            'resnet': [
                'skip_connection_attacks',
                'batch_norm_poisoning',
                'residual_overflow'
            ],
            'transformer': [
                'attention_overflow',
                'position_encoding_attacks',
                'token_limit_exploits'
            ],
            'vit': [
                'patch_shuffling',
                'class_token_poisoning',
                'position_embedding_attacks'
            ]
        }
        
        return vuln_database.get(self.model_type, [])
        
    def test_skip_connection_vulnerability(self, test_input):
        """Test ResNet-specific skip connection vulnerabilities"""
        # Craft input that maximally activates skip connections
        perturbation = torch.zeros_like(test_input)
        
        # Binary search for minimal perturbation that causes misclassification
        low, high = 0.0, 1.0
        
        for _ in range(10):
            mid = (low + high) / 2
            perturbed = test_input + mid * self.craft_skip_perturbation(test_input)
            
            output = self.model(perturbed)
            
            if output.argmax() != self.model(test_input).argmax():
                high = mid
            else:
                low = mid
                
        return {
            'vulnerability': 'skip_connection',
            'min_perturbation': high,
            'exploitable': high < 0.1
        }
```

### Logit-Based Analysis

**1. Confidence Analysis Testing**
```python
class LogitBasedTesting:
    """Testing using output logits/probabilities"""
    
    def __init__(self, model_interface):
        self.model = model_interface
        
    def analyze_confidence_surface(self, input_sample, num_perturbations=100):
        """Analyze how confidence changes with perturbations"""
        original_output = self.model(input_sample)
        original_probs = F.softmax(original_output, dim=-1)
        original_confidence = original_probs.max().item()
        original_pred = original_output.argmax().item()
        
        confidence_map = []
        
        for _ in range(num_perturbations):
            # Random perturbation
            noise = torch.randn_like(input_sample) * 0.01
            perturbed = input_sample + noise
            
            # Get new confidence
            output = self.model(perturbed)
            probs = F.softmax(output, dim=-1)
            confidence = probs.max().item()
            pred = output.argmax().item()
            
            confidence_map.append({
                'perturbation_norm': noise.norm().item(),
                'confidence': confidence,
                'confidence_change': confidence - original_confidence,
                'prediction_changed': pred != original_pred,
                'logit_distance': (output - original_output).norm().item()
            })
            
        return self.analyze_confidence_patterns(confidence_map)
        
    def test_calibration_vulnerabilities(self, test_set):
        """Test for miscalibration that can be exploited"""
        calibration_issues = []
        
        for x, y in test_set:
            output = self.model(x)
            probs = F.softmax(output, dim=-1)
            
            # Get top-2 predictions
            top2_probs, top2_indices = probs.topk(2)
            confidence_gap = top2_probs[0] - top2_probs[1]
            
            # Look for exploitable patterns
            if confidence_gap < 0.1:  # Close decision
                # Test if small perturbation flips decision
                flip_test = self.test_decision_flip(x, top2_indices)
                
                if flip_test['easily_flippable']:
                    calibration_issues.append({
                        'input': x,
                        'true_label': y,
                        'confidence_gap': confidence_gap.item(),
                        'flip_perturbation': flip_test['min_perturbation']
                    })
                    
        return calibration_issues
```

**2. Logit Dynamics Analysis**
```python
class LogitDynamicsAnalyzer:
    """Analyze model behavior through logit evolution"""
    
    def __init__(self, model_with_logits):
        self.model = model_with_logits
        
    def trace_logit_trajectory(self, start_input, target_input, steps=100):
        """Trace how logits change along interpolation path"""
        trajectory = []
        
        for i in range(steps + 1):
            alpha = i / steps
            interpolated = (1 - alpha) * start_input + alpha * target_input
            
            logits = self.model(interpolated)
            
            trajectory.append({
                'step': i,
                'alpha': alpha,
                'logits': logits.detach(),
                'prediction': logits.argmax().item(),
                'entropy': -torch.sum(F.softmax(logits, dim=-1) * 
                                     F.log_softmax(logits, dim=-1)).item()
            })
            
        return self.analyze_trajectory(trajectory)
        
    def find_logit_cliffs(self, trajectory):
        """Find sudden changes in logit landscape"""
        cliffs = []
        
        for i in range(1, len(trajectory)):
            logit_change = (trajectory[i]['logits'] - trajectory[i-1]['logits']).norm()
            
            if logit_change > 0.5:  # Threshold for "cliff"
                cliffs.append({
                    'position': trajectory[i]['alpha'],
                    'magnitude': logit_change.item(),
                    'before_pred': trajectory[i-1]['prediction'],
                    'after_pred': trajectory[i]['prediction']
                })
                
        return cliffs
```

### Gradient-Based Grey Box Testing

**1. Input Gradient Analysis**
```python
class InputGradientTesting:
    """Testing using only input gradients"""
    
    def __init__(self, model_interface):
        self.model = model_interface
        
    def compute_input_sensitivity_map(self, input_sample, target_class=None):
        """Create sensitivity map using input gradients"""
        input_sample.requires_grad_(True)
        
        output = self.model(input_sample)
        
        if target_class is None:
            target_class = output.argmax()
            
        # Compute gradient w.r.t. target class
        output[0, target_class].backward()
        
        sensitivity_map = input_sample.grad.abs()
        
        return {
            'sensitivity_map': sensitivity_map,
            'max_sensitivity': sensitivity_map.max().item(),
            'mean_sensitivity': sensitivity_map.mean().item(),
            'sensitive_regions': self.identify_sensitive_regions(sensitivity_map)
        }
        
    def gradient_based_fuzzing(self, seed_input, num_iterations=100):
        """Fuzz testing guided by input gradients"""
        current_input = seed_input.clone()
        found_failures = []
        
        for i in range(num_iterations):
            # Get gradient information
            sensitivity = self.compute_input_sensitivity_map(current_input)
            
            # Focus perturbations on sensitive regions
            mask = sensitivity['sensitivity_map'] > sensitivity['mean_sensitivity']
            
            # Craft perturbation
            perturbation = torch.randn_like(current_input) * mask
            perturbation = perturbation / perturbation.norm() * 0.1
            
            # Apply and test
            test_input = current_input + perturbation
            result = self.test_for_failure(test_input)
            
            if result['is_failure']:
                found_failures.append({
                    'iteration': i,
                    'input': test_input,
                    'failure_type': result['failure_type']
                })
                
            # Update current input probabilistically
            if random.random() < 0.3:
                current_input = test_input
                
        return found_failures
```

### Layer Output Analysis

**1. Intermediate Representation Testing**
```python
class IntermediateLayerTesting:
    """Testing using intermediate layer outputs"""
    
    def __init__(self, model_with_layer_access):
        self.model = model_with_layer_access
        self.layer_names = model_with_layer_access.get_layer_names()
        
    def test_layer_robustness(self, test_input, layer_name):
        """Test robustness of specific layer outputs"""
        # Get original layer output
        original_output = self.model.get_layer_output(test_input, layer_name)
        
        robustness_results = []
        
        # Test with various perturbations
        for noise_level in [0.001, 0.01, 0.1]:
            perturbed_input = test_input + torch.randn_like(test_input) * noise_level
            perturbed_output = self.model.get_layer_output(perturbed_input, layer_name)
            
            # Measure change
            output_change = (perturbed_output - original_output).norm()
            relative_change = output_change / original_output.norm()
            
            robustness_results.append({
                'noise_level': noise_level,
                'absolute_change': output_change.item(),
                'relative_change': relative_change.item(),
                'is_robust': relative_change < noise_level * 10
            })
            
        return robustness_results
        
    def detect_layer_saturation(self, test_set, layer_name):
        """Detect if layer outputs are saturated"""
        layer_outputs = []
        
        for input_batch in test_set:
            output = self.model.get_layer_output(input_batch, layer_name)
            layer_outputs.append(output)
            
        # Analyze saturation
        all_outputs = torch.cat(layer_outputs)
        
        saturation_metrics = {
            'zero_fraction': (all_outputs == 0).float().mean().item(),
            'near_zero_fraction': (all_outputs.abs() < 1e-6).float().mean().item(),
            'activation_sparsity': (all_outputs.abs() < 0.1).float().mean().item(),
            'dynamic_range': (all_outputs.max() - all_outputs.min()).item(),
            'effective_rank': self.compute_effective_rank(all_outputs)
        }
        
        return saturation_metrics
```

### Metadata-Informed Testing

**1. Training-Aware Testing**
```python
class TrainingAwareTesting:
    """Testing strategies based on training metadata"""
    
    def __init__(self, model_interface, training_info):
        self.model = model_interface
        self.training_info = training_info
        
    def test_distribution_shift(self, test_data):
        """Test model on distribution shifts from training data"""
        training_stats = self.training_info['data_statistics']
        
        shift_results = []
        
        for shift_type in ['mean_shift', 'variance_shift', 'skew_shift']:
            shifted_data = self.apply_distribution_shift(
                test_data, 
                shift_type, 
                training_stats
            )
            
            # Test on shifted data
            original_accuracy = self.evaluate_accuracy(test_data)
            shifted_accuracy = self.evaluate_accuracy(shifted_data)
            
            shift_results.append({
                'shift_type': shift_type,
                'original_accuracy': original_accuracy,
                'shifted_accuracy': shifted_accuracy,
                'degradation': original_accuracy - shifted_accuracy
            })
            
        return shift_results
        
    def test_edge_of_training_distribution(self, num_samples=100):
        """Generate tests at edge of training distribution"""
        training_bounds = self.training_info['data_bounds']
        
        edge_samples = []
        
        for _ in range(num_samples):
            # Generate sample near distribution boundary
            dimension = random.randint(0, len(training_bounds) - 1)
            
            if random.random() < 0.5:
                # Near minimum
                base_value = training_bounds[dimension]['min']
                offset = -abs(torch.randn(1).item() * 0.1)
            else:
                # Near maximum
                base_value = training_bounds[dimension]['max']
                offset = abs(torch.randn(1).item() * 0.1)
                
            edge_sample = self.create_edge_sample(dimension, base_value + offset)
            edge_samples.append(edge_sample)
            
        # Test model behavior on edge cases
        return self.evaluate_edge_behavior(edge_samples)
```

### Hybrid Testing Strategies

**1. Adaptive Grey Box Testing**
```python
class AdaptiveGreyBoxTesting:
    """Adapt testing strategy based on available information"""
    
    def __init__(self, model_interface, available_info):
        self.model = model_interface
        self.available_info = available_info
        self.test_strategies = self.select_strategies()
        
    def select_strategies(self):
        """Select optimal strategies based on available information"""
        strategies = []
        
        if 'architecture' in self.available_info:
            strategies.append(ArchitectureAwareTesting(self.available_info['architecture']))
            
        if 'output_logits' in self.available_info:
            strategies.append(LogitBasedTesting(self.model))
            
        if 'input_gradients' in self.available_info:
            strategies.append(InputGradientTesting(self.model))
            
        if 'layer_outputs' in self.available_info:
            strategies.append(IntermediateLayerTesting(self.model))
            
        if 'training_metadata' in self.available_info:
            strategies.append(TrainingAwareTesting(self.model, self.available_info['training_metadata']))
            
        # Always include black-box strategies as fallback
        strategies.append(BlackBoxTesting(self.model))
        
        return strategies
        
    def run_adaptive_test_suite(self, test_data):
        """Run comprehensive test suite adapting to available information"""
        all_results = {}
        
        for strategy in self.test_strategies:
            strategy_name = strategy.__class__.__name__
            print(f"Running {strategy_name}...")
            
            try:
                results = strategy.run_tests(test_data)
                all_results[strategy_name] = results
                
                # Adapt future strategies based on results
                self.adapt_strategies(results)
                
            except Exception as e:
                all_results[strategy_name] = {
                    'error': str(e),
                    'status': 'failed'
                }
                
        return self.synthesize_results(all_results)
```

## Practical Applications

### Production Grey Box Testing System

```python
class ProductionGreyBoxTester:
    """Comprehensive grey box testing for production systems"""
    
    def __init__(self, model_api, access_level, config):
        self.model = model_api
        self.access_level = access_level
        self.config = config
        
        # Initialize appropriate testers
        self.testers = self.initialize_testers()
        
    def initialize_testers(self):
        """Initialize testers based on access level"""
        testers = {}
        
        if self.access_level.has_architecture:
            testers['architecture'] = ArchitectureAwareTesting(
                self.model.get_architecture()
            )
            
        if self.access_level.has_logits:
            testers['logit'] = LogitBasedTesting(self.model)
            
        if self.access_level.has_gradients:
            testers['gradient'] = InputGradientTesting(self.model)
            
        if self.access_level.has_layer_outputs:
            testers['layer'] = IntermediateLayerTesting(self.model)
            
        return testers
        
    def run_comprehensive_tests(self, test_dataset):
        """Run comprehensive grey box test suite"""
        results = {
            'summary': {},
            'detailed_results': {},
            'vulnerabilities': [],
            'recommendations': []
        }
        
        # 1. Architecture-specific tests
        if 'architecture' in self.testers:
            arch_results = self.run_architecture_tests(test_dataset)
            results['detailed_results']['architecture'] = arch_results
            
        # 2. Confidence and calibration tests
        if 'logit' in self.testers:
            logit_results = self.run_logit_tests(test_dataset)
            results['detailed_results']['logit_analysis'] = logit_results
            
        # 3. Sensitivity analysis
        if 'gradient' in self.testers:
            gradient_results = self.run_gradient_tests(test_dataset)
            results['detailed_results']['sensitivity'] = gradient_results
            
        # 4. Layer behavior analysis
        if 'layer' in self.testers:
            layer_results = self.run_layer_tests(test_dataset)
            results['detailed_results']['layer_analysis'] = layer_results
            
        # 5. Synthesize findings
        results['summary'] = self.synthesize_findings(results['detailed_results'])
        results['vulnerabilities'] = self.identify_vulnerabilities(results['detailed_results'])
        results['recommendations'] = self.generate_recommendations(results)
        
        return results
```

### Real-World Case Study: API with Logit Access

```python
class APIGreyBoxTesting:
    """Grey box testing for ML APIs that provide confidence scores"""
    
    def __init__(self, api_endpoint, api_key):
        self.api = APIClient(api_endpoint, api_key)
        self.test_history = []
        
    def test_confidence_manipulation(self, test_inputs):
        """Test if confidence scores can be manipulated"""
        manipulation_results = []
        
        for input_data in test_inputs:
            # Get baseline
            baseline = self.api.predict_with_confidence(input_data)
            
            # Try to minimize confidence while maintaining prediction
            low_conf_input = self.minimize_confidence(
                input_data, 
                baseline['prediction']
            )
            
            # Try to maximize confidence for wrong prediction
            wrong_pred = (baseline['prediction'] + 1) % baseline['num_classes']
            high_conf_wrong = self.maximize_confidence_for_class(
                input_data,
                wrong_pred
            )
            
            manipulation_results.append({
                'original': baseline,
                'low_confidence_same_pred': self.api.predict_with_confidence(low_conf_input),
                'high_confidence_wrong_pred': self.api.predict_with_confidence(high_conf_wrong)
            })
            
        return self.analyze_manipulation_results(manipulation_results)
        
    def minimize_confidence(self, input_data, target_prediction, max_queries=50):
        """Find input that gives minimum confidence for target prediction"""
        current_input = input_data.copy()
        best_input = current_input
        min_confidence = 1.0
        
        for _ in range(max_queries):
            # Small perturbation
            perturbation = np.random.randn(*input_data.shape) * 0.01
            test_input = current_input + perturbation
            
            # Query API
            result = self.api.predict_with_confidence(test_input)
            
            if (result['prediction'] == target_prediction and 
                result['confidence'] < min_confidence):
                min_confidence = result['confidence']
                best_input = test_input
                
            # Gradient-free optimization
            if np.random.random() < 0.3:
                current_input = test_input
                
        return best_input
```

### Automated Vulnerability Discovery

```python
class GreyBoxVulnerabilityScanner:
    """Automated vulnerability discovery using grey box access"""
    
    def __init__(self, model_interface, grey_box_info):
        self.model = model_interface
        self.info = grey_box_info
        self.vulnerability_db = self.load_vulnerability_patterns()
        
    def scan_for_vulnerabilities(self):
        """Comprehensive vulnerability scan"""
        found_vulnerabilities = []
        
        # 1. Architecture-specific vulnerabilities
        if 'architecture' in self.info:
            arch_vulns = self.scan_architecture_vulnerabilities()
            found_vulnerabilities.extend(arch_vulns)
            
        # 2. Gradient-based vulnerabilities
        if 'gradients' in self.info:
            grad_vulns = self.scan_gradient_vulnerabilities()
            found_vulnerabilities.extend(grad_vulns)
            
        # 3. Output distribution vulnerabilities
        if 'logits' in self.info:
            output_vulns = self.scan_output_vulnerabilities()
            found_vulnerabilities.extend(output_vulns)
            
        # 4. Cross-reference with known vulnerabilities
        matched_vulns = self.match_known_vulnerabilities(found_vulnerabilities)
        
        return {
            'discovered_vulnerabilities': found_vulnerabilities,
            'known_vulnerabilities': matched_vulns,
            'risk_assessment': self.assess_overall_risk(found_vulnerabilities)
        }
        
    def scan_architecture_vulnerabilities(self):
        """Scan for architecture-specific vulnerabilities"""
        vulnerabilities = []
        
        arch = self.info['architecture']
        
        # Check for vulnerable layer combinations
        if self.has_vulnerable_pattern(arch, 'attention_overflow'):
            vuln = self.test_attention_overflow()
            if vuln['exploitable']:
                vulnerabilities.append(vuln)
                
        # Check for normalization vulnerabilities
        if self.has_normalization_layers(arch):
            vuln = self.test_normalization_attacks()
            if vuln['exploitable']:
                vulnerabilities.append(vuln)
                
        return vulnerabilities
```

## Common Pitfalls

### 1. Over-relying on Partial Information

**Mistake**: Assuming partial information tells the whole story
**Problem**: Missing critical vulnerabilities visible only through other channels
**Solution**: Always complement grey box testing with black box validation

### 2. Inefficient Information Usage

**Mistake**: Not fully leveraging available grey box information
**Problem**: Missing optimization opportunities
**Solution**: Design tests specifically for available information types

### 3. Static Testing Strategies

**Mistake**: Using the same tests regardless of information availability
**Problem**: Suboptimal test coverage and efficiency
**Solution**: Adaptive testing that adjusts to available access

### 4. Ignoring Information Quality

**Mistake**: Trusting all grey box information equally
**Problem**: Outdated or incorrect information leads to bad tests
**Solution**: Validate grey box information through black box testing

### 5. Architecture Overfitting

**Mistake**: Designing tests too specific to known architecture
**Problem**: Tests break with minor architecture changes
**Solution**: Build robust tests that work across architecture variants

## Hands-on Exercise

Build a grey box testing framework:

1. **Implement access level detection**:
   - Automatic discovery of available information
   - Access level classification
   - Capability assessment
   - Information quality validation

2. **Create adaptive testers**:
   - Architecture-aware tester
   - Logit-based analyzer
   - Gradient-guided fuzzer
   - Layer output monitor

3. **Build test optimization**:
   - Information-based test prioritization
   - Efficient query strategies
   - Result caching and reuse
   - Adaptive sampling

4. **Develop vulnerability scanners**:
   - Architecture-specific scanners
   - Confidence manipulation detectors
   - Distribution shift testers
   - Known vulnerability matchers

5. **Create reporting system**:
   - Multi-level result aggregation
   - Vulnerability prioritization
   - Actionable recommendations
   - Comparative analysis

## Further Reading

- "Grey-box Testing of Deep Neural Networks" - Gopinath et al. 2019
- "Hybrid Testing Approaches for AI Systems" - Ma et al. 2020
- "Leveraging Partial Model Access for Efficient Testing" - Zhang et al. 2021
- "Grey-box Adversarial Testing" - Wicker et al. 2018
- "Adaptive Testing Strategies for Neural Networks" - Pei et al. 2019
- "Efficient Test Generation with Limited Model Access" - Kim et al. 2020

## Connections

- **Related Topics**: [White Box Testing](#white-box-testing), [Black Box Testing](#black-box-testing), [Hybrid Approaches](#hybrid-testing)
- **Prerequisites**: [Neural Network Basics](#neural-networks), [Testing Fundamentals](#testing-basics)
- **Next Steps**: [Vulnerability Assessment](#vulnerability-scanning), [Adaptive Testing](#adaptive-strategies)