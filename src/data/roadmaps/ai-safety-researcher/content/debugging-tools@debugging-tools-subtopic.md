# AI Debugging Frameworks

## Learning Objectives

- Master essential debugging tools: TensorBoard, Weights & Biases, MLflow, and specialized AI debuggers
- Build systematic debugging workflows for different types of AI failures
- Implement comprehensive logging and monitoring for AI systems
- Debug training failures, inference errors, and safety violations
- Create custom debugging tools for specific AI safety challenges

## Introduction

Debugging AI systems is fundamentally different from debugging traditional software. When your code has a bug, you fix the logic. When your AI has a bug, the problem could be in the data, the architecture, the training process, the deployment environment, or emergent behaviors you never anticipated.

For AI safety, debugging is critical because:
- **Silent failures**: AI systems can fail in subtle ways that aren't immediately obvious
- **Distribution shifts**: Models can work perfectly in testing but fail catastrophically in deployment
- **Emergent behaviors**: Large models can develop capabilities and failures not present in smaller versions
- **Safety violations**: We need to catch potential harms before they reach users
- **Alignment verification**: Ensuring models actually do what we intend

This isn't just about fixing errors - it's about building systems that help us understand and control increasingly powerful AI systems.

## Core Concepts

### 1. Experiment Tracking and Versioning

Modern AI development requires tracking hundreds of experiments with different configurations:

**MLflow Tracking**:
```python
import mlflow
import mlflow.pytorch

# Start experiment
mlflow.set_experiment("safety-alignment-v2")

with mlflow.start_run():
    # Log parameters
    mlflow.log_params({
        "model_size": "7B",
        "learning_rate": 1e-4,
        "safety_coefficient": 0.3,
        "training_dataset": "helpful_harmless_v2"
    })
    
    # Training loop
    for epoch in range(num_epochs):
        train_loss = train_epoch(model, data)
        
        # Log metrics
        mlflow.log_metrics({
            "train_loss": train_loss,
            "safety_score": evaluate_safety(model),
            "capability_score": evaluate_capabilities(model),
            "alignment_tax": capability_score - safety_score
        })
        
        # Log model checkpoint
        if epoch % save_frequency == 0:
            mlflow.pytorch.log_model(model, f"model_epoch_{epoch}")
    
    # Log artifacts
    mlflow.log_artifact("safety_evaluation_report.pdf")
    mlflow.log_artifact("failure_cases.json")
```

**Weights & Biases Integration**:
```python
import wandb

# Initialize W&B
wandb.init(
    project="ai-safety-debugging",
    config={
        "architecture": "transformer",
        "dataset": "anthropic_helpful_harmless",
        "safety_measures": ["constitutional_ai", "debate_training"]
    }
)

# Custom safety monitoring
class SafetyMonitor:
    def __init__(self):
        self.harmful_outputs = []
        self.safety_violations = []
        
    def log_generation(self, prompt, output, safety_score):
        wandb.log({
            "prompt": wandb.Html(prompt),
            "output": wandb.Html(output),
            "safety_score": safety_score,
            "is_harmful": safety_score < 0.5
        })
        
        if safety_score < 0.5:
            self.harmful_outputs.append({
                "prompt": prompt,
                "output": output,
                "score": safety_score
            })
            
            # Alert on severe violations
            if safety_score < 0.2:
                wandb.alert(
                    title="Severe Safety Violation",
                    text=f"Model generated harmful content: {output[:100]}..."
                )
```

### 2. Real-Time Training Diagnostics

Understanding what's happening during training is crucial:

**TensorBoard for Deep Diagnostics**:
```python
from torch.utils.tensorboard import SummaryWriter
import torch.nn.functional as F

writer = SummaryWriter('runs/safety_alignment_experiment')

class DebugCallback:
    def __init__(self, model, writer):
        self.model = model
        self.writer = writer
        self.step = 0
        
    def on_batch_end(self, batch, outputs, loss):
        # Log gradients
        for name, param in self.model.named_parameters():
            if param.grad is not None:
                self.writer.add_histogram(f'gradients/{name}', param.grad, self.step)
                self.writer.add_scalar(f'gradient_norm/{name}', param.grad.norm(), self.step)
        
        # Log activations
        def hook_fn(module, input, output, name):
            self.writer.add_histogram(f'activations/{name}', output, self.step)
            
            # Detect dead neurons
            dead_neurons = (output == 0).float().mean()
            self.writer.add_scalar(f'dead_neurons/{name}', dead_neurons, self.step)
            
        # Register hooks
        for name, module in self.model.named_modules():
            if isinstance(module, torch.nn.Linear):
                module.register_forward_hook(lambda m, i, o: hook_fn(m, i, o, name))
        
        # Log attention patterns for interpretability
        if hasattr(outputs, 'attentions'):
            attention = outputs.attentions[-1]  # Last layer
            self.writer.add_image('attention_pattern', attention[0, 0], self.step)
        
        self.step += 1
```

### 3. Model Behavior Analysis

Understanding how your model behaves across different inputs:

```python
class BehaviorDebugger:
    def __init__(self, model, tokenizer):
        self.model = model
        self.tokenizer = tokenizer
        self.test_suites = {
            'safety': self.load_safety_tests(),
            'capabilities': self.load_capability_tests(),
            'robustness': self.load_robustness_tests(),
            'fairness': self.load_fairness_tests()
        }
    
    def comprehensive_debug(self):
        results = {}
        
        for suite_name, test_cases in self.test_suites.items():
            suite_results = []
            
            for test in test_cases:
                # Generate output
                output = self.model.generate(test['input'])
                
                # Evaluate against expected behavior
                passed = self.evaluate_test(output, test['expected'])
                
                # Detailed analysis for failures
                if not passed:
                    analysis = self.analyze_failure(test, output)
                    suite_results.append({
                        'test': test,
                        'output': output,
                        'passed': False,
                        'analysis': analysis
                    })
                    
                    # Log failure pattern
                    self.log_failure_pattern(suite_name, test, output, analysis)
                
            results[suite_name] = {
                'pass_rate': sum(r['passed'] for r in suite_results) / len(suite_results),
                'failures': [r for r in suite_results if not r['passed']]
            }
        
        return results
    
    def analyze_failure(self, test, output):
        """Deep dive into why a test failed"""
        analysis = {
            'prompt_features': self.extract_prompt_features(test['input']),
            'output_features': self.extract_output_features(output),
            'attention_analysis': self.analyze_attention_patterns(test['input'], output),
            'similar_passing_tests': self.find_similar_passing_tests(test),
            'hypotheses': self.generate_failure_hypotheses(test, output)
        }
        return analysis
```

### 4. Production Monitoring and Debugging

Debugging doesn't stop at deployment:

```python
class ProductionDebugger:
    def __init__(self, model_id, monitoring_config):
        self.model_id = model_id
        self.monitoring = self.setup_monitoring(monitoring_config)
        
    def setup_monitoring(self, config):
        return {
            'performance': PerformanceMonitor(config['latency_threshold']),
            'safety': SafetyMonitor(config['safety_thresholds']),
            'drift': DriftDetector(config['baseline_distribution']),
            'anomaly': AnomalyDetector(config['anomaly_params'])
        }
    
    def continuous_debugging(self, request_stream):
        for request in request_stream:
            # Process request
            start_time = time.time()
            response = self.model.process(request)
            latency = time.time() - start_time
            
            # Multi-dimensional monitoring
            issues = []
            
            # Performance debugging
            if latency > self.monitoring['performance'].threshold:
                perf_debug = self.debug_performance(request, latency)
                issues.append(('performance', perf_debug))
            
            # Safety debugging
            safety_score = self.monitoring['safety'].evaluate(request, response)
            if safety_score < self.monitoring['safety'].threshold:
                safety_debug = self.debug_safety_violation(request, response)
                issues.append(('safety', safety_debug))
            
            # Distribution shift debugging
            if self.monitoring['drift'].detect_drift(request):
                drift_debug = self.debug_distribution_shift(request)
                issues.append(('drift', drift_debug))
            
            # Anomaly debugging
            if self.monitoring['anomaly'].is_anomalous(request, response):
                anomaly_debug = self.debug_anomaly(request, response)
                issues.append(('anomaly', anomaly_debug))
            
            # Log and alert
            if issues:
                self.handle_issues(request, response, issues)
    
    def debug_safety_violation(self, request, response):
        """Deep analysis of safety failures"""
        return {
            'severity': self.assess_severity(response),
            'category': self.categorize_violation(response),
            'contributing_factors': self.analyze_contributing_factors(request),
            'similar_violations': self.find_similar_violations(request, response),
            'recommended_actions': self.recommend_mitigations(request, response)
        }
```

### 5. Custom Safety Debugging Tools

Building specialized tools for AI safety challenges:

```python
class AlignmentDebugger:
    """Debug alignment between intended and actual behavior"""
    
    def __init__(self, model, intended_behavior_spec):
        self.model = model
        self.spec = intended_behavior_spec
        self.violation_database = []
        
    def debug_alignment(self, test_scenarios):
        alignment_report = {
            'overall_alignment': 0,
            'category_breakdown': {},
            'severe_misalignments': [],
            'edge_cases': []
        }
        
        for scenario in test_scenarios:
            # Get model behavior
            actual_behavior = self.model.run_scenario(scenario)
            
            # Compare with intended
            alignment_score = self.compute_alignment(
                actual_behavior, 
                self.spec.get_intended_behavior(scenario)
            )
            
            if alignment_score < 0.8:  # Misalignment threshold
                # Deep debugging for misalignment
                debug_info = self.debug_misalignment(scenario, actual_behavior)
                
                # Categorize the misalignment
                category = self.categorize_misalignment(debug_info)
                alignment_report['category_breakdown'][category] = \
                    alignment_report['category_breakdown'].get(category, 0) + 1
                
                # Check severity
                if debug_info['severity'] > 0.7:
                    alignment_report['severe_misalignments'].append({
                        'scenario': scenario,
                        'debug_info': debug_info,
                        'recommended_fixes': self.suggest_fixes(debug_info)
                    })
            
            # Check for edge cases
            if self.is_edge_case(scenario, actual_behavior):
                alignment_report['edge_cases'].append({
                    'scenario': scenario,
                    'behavior': actual_behavior,
                    'analysis': self.analyze_edge_case(scenario, actual_behavior)
                })
        
        alignment_report['overall_alignment'] = self.compute_overall_alignment()
        return alignment_report
    
    def debug_misalignment(self, scenario, behavior):
        """Detailed analysis of why alignment failed"""
        return {
            'scenario_features': self.extract_scenario_features(scenario),
            'behavior_analysis': self.analyze_behavior(behavior),
            'intention_gap': self.measure_intention_gap(scenario, behavior),
            'potential_causes': self.hypothesize_causes(scenario, behavior),
            'severity': self.assess_misalignment_severity(scenario, behavior)
        }
```

## Common Pitfalls

### 1. Debugging the Wrong Layer
**Problem**: Spending hours debugging model weights when the issue is bad data.
**Solution**: Always debug systematically: Data → Preprocessing → Model → Training → Deployment. Use ablation testing to isolate issues.

### 2. Over-Reliance on Metrics
**Problem**: Your loss is decreasing but your model is learning to game the metric.
**Solution**: Use multiple metrics, qualitative evaluation, and adversarial testing. If safety_score=0.99, be suspicious.

### 3. Debugging in Production Only
**Problem**: Finding critical issues only after deployment.
**Solution**: Build comprehensive test suites that simulate production conditions. Use shadow deployments for testing.

### 4. Ignoring Rare Events
**Problem**: Your model works 99.9% of the time, but that 0.1% is catastrophic.
**Solution**: Specifically test edge cases, use anomaly detection, and maintain databases of failure cases.

### 5. Tool Overload
**Problem**: Using every debugging tool available, creating more confusion than clarity.
**Solution**: Start simple. Master one tool deeply before adding others. Build custom tools for your specific needs.

## Practical Exercise: Building a Safety Debugging Pipeline

Let's build a comprehensive debugging system for a language model:

```python
import torch
import numpy as np
from dataclasses import dataclass
from typing import List, Dict, Any

@dataclass
class DebugConfig:
    log_dir: str = "./debug_logs"
    safety_threshold: float = 0.8
    performance_threshold: float = 100  # ms
    anomaly_detection: bool = True
    save_failure_cases: bool = True

class ComprehensiveSafetyDebugger:
    def __init__(self, model, config: DebugConfig):
        self.model = model
        self.config = config
        
        # Initialize debugging components
        self.experiment_tracker = self._init_mlflow()
        self.realtime_monitor = self._init_wandb()
        self.visualizer = self._init_tensorboard()
        
        # Safety-specific debuggers
        self.safety_debugger = SafetyDebugger(model)
        self.alignment_debugger = AlignmentDebugger(model)
        self.robustness_debugger = RobustnessDebugger(model)
        
    def debug_training_run(self, train_loader, val_loader, epochs):
        """Comprehensive debugging during training"""
        
        for epoch in range(epochs):
            # Training debugging
            train_metrics = self.debug_epoch(train_loader, is_training=True)
            
            # Validation debugging with safety focus
            val_metrics = self.debug_epoch(val_loader, is_training=False)
            
            # Safety-specific evaluations
            safety_report = self.run_safety_evaluation()
            
            # Log everything
            self.log_comprehensive_metrics({
                'epoch': epoch,
                'train': train_metrics,
                'val': val_metrics,
                'safety': safety_report
            })
            
            # Early stopping on safety violations
            if safety_report['critical_violations'] > 0:
                self.handle_critical_safety_failure(safety_report)
                break
    
    def debug_epoch(self, data_loader, is_training):
        """Debug single epoch with detailed tracking"""
        metrics = {
            'losses': [],
            'gradients': [],
            'activations': [],
            'safety_scores': [],
            'anomalies': []
        }
        
        for batch_idx, batch in enumerate(data_loader):
            # Forward pass with debugging hooks
            with self.debugging_context():
                outputs = self.model(batch)
                loss = self.compute_loss(outputs, batch)
                
                # Safety checking
                safety_score = self.safety_debugger.evaluate_batch(batch, outputs)
                metrics['safety_scores'].append(safety_score)
                
                # Anomaly detection
                if self.config.anomaly_detection:
                    anomalies = self.detect_anomalies(batch, outputs)
                    if anomalies:
                        metrics['anomalies'].extend(anomalies)
                        self.investigate_anomaly(batch, outputs, anomalies)
                
                # Gradient analysis
                if is_training:
                    loss.backward()
                    grad_stats = self.analyze_gradients()
                    metrics['gradients'].append(grad_stats)
                    
                    # Detect training issues
                    self.detect_training_issues(grad_stats)
        
        return self.summarize_metrics(metrics)
    
    def run_safety_evaluation(self):
        """Comprehensive safety debugging"""
        safety_report = {
            'harmfulness_test': self.test_harmfulness(),
            'robustness_test': self.test_robustness(),
            'fairness_test': self.test_fairness(),
            'alignment_test': self.test_alignment(),
            'critical_violations': 0
        }
        
        # Count critical issues
        for test_name, test_result in safety_report.items():
            if isinstance(test_result, dict) and test_result.get('critical_failures', 0) > 0:
                safety_report['critical_violations'] += test_result['critical_failures']
        
        return safety_report
    
    def investigate_anomaly(self, batch, outputs, anomalies):
        """Deep dive into anomalous behavior"""
        investigation = {
            'timestamp': time.time(),
            'batch_analysis': self.analyze_batch(batch),
            'output_analysis': self.analyze_outputs(outputs),
            'anomaly_details': anomalies,
            'similar_cases': self.find_similar_anomalies(anomalies),
            'hypotheses': self.generate_anomaly_hypotheses(batch, outputs, anomalies)
        }
        
        # Save for offline analysis
        if self.config.save_failure_cases:
            self.save_investigation(investigation)
        
        # Real-time alert for severe anomalies
        if self.is_severe_anomaly(anomalies):
            self.alert_severe_anomaly(investigation)
        
        return investigation
    
    def generate_debug_report(self):
        """Generate comprehensive debugging report"""
        report = {
            'model_info': self.get_model_info(),
            'training_summary': self.summarize_training(),
            'safety_assessment': self.assess_overall_safety(),
            'performance_analysis': self.analyze_performance(),
            'failure_patterns': self.analyze_failure_patterns(),
            'recommendations': self.generate_recommendations()
        }
        
        # Create visualizations
        self.create_debug_visualizations(report)
        
        # Save report
        self.save_report(report)
        
        return report

# Usage
debugger = ComprehensiveSafetyDebugger(model, DebugConfig())
debugger.debug_training_run(train_loader, val_loader, epochs=10)
report = debugger.generate_debug_report()
```

## Further Reading

### Essential Resources
- [Debugging Machine Learning Models](https://fullstackdeeplearning.com/spring2021/lecture-7/) - Full Stack Deep Learning
- [A Guide to Debugging Neural Networks](https://github.com/ttumiel/debugging-neural-networks) - Common issues and solutions
- [ML Debugging with TensorBoard](https://www.tensorflow.org/tensorboard/debugger_v2) - Official guide
- [Weights & Biases Best Practices](https://docs.wandb.ai/guides/best-practices) - Production debugging

### Papers
- "Debugging Machine Learning Models" - Zhang et al. (systematic approaches)
- "Model Assertions for Monitoring and Improving ML" - Kang et al.
- "Automated Debugging of Deep Neural Networks" - Ma et al.
- "SafeML: Safety Monitoring of Machine Learning Classifiers" - Amodei et al.

### Tools and Frameworks
- [Aim](https://github.com/aimhubio/aim) - Open-source experiment tracking
- [ClearML](https://clear.ml/) - Full MLOps platform with debugging
- [Evidently AI](https://evidentlyai.com/) - ML monitoring and debugging
- [Deepchecks](https://deepchecks.com/) - Testing and validating ML models

## Connections

### Related Topics
- **mechanistic-interp**: Understanding model internals for better debugging
- **explainable-ai**: Making debugging insights accessible
- **safety-monitoring**: Real-time debugging in production
- **testing-methods**: Systematic approaches to finding bugs

### Key Figures
- **Andrew Ng**: Emphasizes systematic debugging in ML
- **Lukas Biewald**: Founder of Weights & Biases
- **Cliff Click**: Debugging distributed systems insights applicable to ML

### Applications
- **Model Development**: Catching issues during training
- **Safety Validation**: Ensuring models meet safety requirements
- **Production Monitoring**: Debugging deployed systems
- **Incident Response**: Rapid debugging when things go wrong