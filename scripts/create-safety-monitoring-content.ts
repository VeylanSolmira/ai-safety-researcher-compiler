import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const safetyMonitoringContent = {
  id: 'safety-monitoring',
  academicContent: `# Real-time Safety Monitoring

## Learning Objectives

By the end of this topic, you should be able to:
- Design real-time monitoring systems for AI safety
- Implement continuous safety evaluation pipelines
- Build anomaly detection for model behavior
- Create effective alerting and response systems
- Understand the trade-offs between safety and performance

## Introduction

Real-time safety monitoring is the practice of continuously observing AI systems in production to detect and respond to safety issues as they occur. Unlike static evaluation, which tests models before deployment, real-time monitoring provides ongoing assurance that models behave safely under actual usage conditions.

As AI systems become more autonomous and widely deployed, the ability to monitor their behavior in real-time becomes critical. This includes detecting prompt injection attempts, identifying unusual model outputs, tracking capability drift, and responding to emerging threats before they cause harm.

## Core Concepts

### Components of Real-time Monitoring

#### 1. Input Analysis Pipeline

\`\`\`python
class InputAnalyzer:
    def __init__(self):
        self.threat_detectors = {
            'prompt_injection': self.detect_injection,
            'jailbreak_attempt': self.detect_jailbreak,
            'data_extraction': self.detect_extraction_attempt,
            'adversarial_input': self.detect_adversarial
        }
        self.risk_threshold = 0.7
    
    def analyze_input(self, user_input, context=None):
        """Analyze input for safety risks before model processing"""
        risk_scores = {}
        detected_threats = []
        
        for threat_type, detector in self.threat_detectors.items():
            score, details = detector(user_input, context)
            risk_scores[threat_type] = score
            
            if score > self.risk_threshold:
                detected_threats.append({
                    'type': threat_type,
                    'score': score,
                    'details': details,
                    'timestamp': datetime.now()
                })
        
        overall_risk = max(risk_scores.values())
        
        return {
            'risk_level': overall_risk,
            'threats': detected_threats,
            'should_block': overall_risk > 0.9,
            'should_flag': overall_risk > 0.7
        }
\`\`\`

#### 2. Output Monitoring System

\`\`\`python
class OutputMonitor:
    def __init__(self, model_id):
        self.model_id = model_id
        self.safety_classifier = load_safety_classifier()
        self.content_filters = self.initialize_filters()
        self.baseline_behavior = self.load_baseline()
        
    def monitor_output(self, prompt, response, metadata):
        """Comprehensive output safety analysis"""
        analysis = {
            'timestamp': datetime.now(),
            'prompt_hash': hash_prompt(prompt),
            'response_length': len(response),
            'checks': {}
        }
        
        # Content safety check
        safety_score = self.safety_classifier.evaluate(response)
        analysis['checks']['content_safety'] = {
            'score': safety_score,
            'passed': safety_score > 0.8
        }
        
        # Filter violations
        filter_results = self.apply_content_filters(response)
        analysis['checks']['content_filters'] = filter_results
        
        # Behavioral anomaly detection
        anomaly_score = self.detect_behavioral_anomaly(prompt, response)
        analysis['checks']['behavioral_anomaly'] = {
            'score': anomaly_score,
            'is_anomalous': anomaly_score > 0.7
        }
        
        # Capability monitoring
        capability_check = self.check_capability_boundaries(response)
        analysis['checks']['capability_bounds'] = capability_check
        
        return self.aggregate_analysis(analysis)
\`\`\`

#### 3. Behavioral Anomaly Detection

\`\`\`python
class BehavioralAnomalyDetector:
    def __init__(self, model_id, window_size=1000):
        self.model_id = model_id
        self.window_size = window_size
        self.behavior_baseline = self.compute_baseline()
        self.recent_behaviors = deque(maxlen=window_size)
        
    def detect_anomalies(self, interaction):
        """Detect deviations from expected behavior patterns"""
        
        # Extract behavioral features
        features = self.extract_behavioral_features(interaction)
        self.recent_behaviors.append(features)
        
        # Compare to baseline
        deviation_scores = {}
        
        # Response length anomaly
        avg_length = np.mean([b['response_length'] for b in self.recent_behaviors])
        baseline_length = self.behavior_baseline['avg_response_length']
        deviation_scores['length'] = abs(avg_length - baseline_length) / baseline_length
        
        # Refusal rate anomaly
        recent_refusal_rate = self.calculate_recent_refusal_rate()
        baseline_refusal = self.behavior_baseline['refusal_rate']
        deviation_scores['refusal'] = abs(recent_refusal_rate - baseline_refusal)
        
        # Topic drift detection
        topic_drift = self.detect_topic_drift(features)
        deviation_scores['topic_drift'] = topic_drift
        
        # Aggregate anomaly score
        anomaly_score = self.aggregate_anomaly_scores(deviation_scores)
        
        return {
            'anomaly_score': anomaly_score,
            'deviations': deviation_scores,
            'is_anomalous': anomaly_score > self.anomaly_threshold,
            'recommended_action': self.recommend_action(anomaly_score)
        }
\`\`\`

### Real-time Processing Architecture

\`\`\`python
class SafetyMonitoringPipeline:
    def __init__(self, model, config):
        self.model = model
        self.config = config
        self.input_analyzer = InputAnalyzer()
        self.output_monitor = OutputMonitor(model.id)
        self.anomaly_detector = BehavioralAnomalyDetector(model.id)
        self.alert_system = AlertSystem(config.alert_channels)
        self.metrics_collector = MetricsCollector()
        
    async def process_request(self, request):
        """Process a request with full safety monitoring"""
        monitoring_data = {
            'request_id': generate_request_id(),
            'timestamp': datetime.now(),
            'user_id': request.user_id
        }
        
        # Pre-processing safety check
        input_analysis = self.input_analyzer.analyze_input(
            request.prompt, 
            request.context
        )
        monitoring_data['input_analysis'] = input_analysis
        
        if input_analysis['should_block']:
            return self.handle_blocked_request(request, input_analysis)
        
        # Generate response with monitoring
        start_time = time.time()
        response = await self.model.generate(
            request.prompt,
            temperature=self.get_safe_temperature(input_analysis),
            max_tokens=self.get_safe_max_tokens(input_analysis)
        )
        generation_time = time.time() - start_time
        
        # Post-processing safety check
        output_analysis = self.output_monitor.monitor_output(
            request.prompt,
            response,
            {'generation_time': generation_time}
        )
        monitoring_data['output_analysis'] = output_analysis
        
        # Behavioral analysis
        anomaly_analysis = self.anomaly_detector.detect_anomalies({
            'prompt': request.prompt,
            'response': response,
            'analysis': output_analysis
        })
        monitoring_data['anomaly_analysis'] = anomaly_analysis
        
        # Take action based on analysis
        action = self.determine_action(
            input_analysis,
            output_analysis,
            anomaly_analysis
        )
        
        if action.requires_intervention:
            await self.handle_intervention(action, monitoring_data)
        
        # Log metrics
        await self.metrics_collector.log(monitoring_data)
        
        return {
            'response': action.modified_response or response,
            'monitoring_data': monitoring_data if self.config.expose_monitoring else None
        }
\`\`\`

### Alerting and Response Systems

\`\`\`python
class AlertSystem:
    def __init__(self, channels):
        self.channels = channels
        self.alert_queue = asyncio.Queue()
        self.alert_history = deque(maxlen=10000)
        self.alert_thresholds = self.configure_thresholds()
        
    async def process_alert(self, alert_data):
        """Process and route alerts based on severity and type"""
        severity = self.calculate_severity(alert_data)
        alert = {
            'id': generate_alert_id(),
            'timestamp': datetime.now(),
            'severity': severity,
            'type': alert_data['type'],
            'details': alert_data,
            'status': 'new'
        }
        
        # Check if we should suppress (avoid alert fatigue)
        if not self.should_suppress_alert(alert):
            await self.alert_queue.put(alert)
            
            # Immediate action for critical alerts
            if severity == 'critical':
                await self.handle_critical_alert(alert)
            
        self.alert_history.append(alert)
        return alert
    
    async def handle_critical_alert(self, alert):
        """Immediate response to critical safety issues"""
        # Notify all channels immediately
        tasks = []
        for channel in self.channels:
            if channel.supports_priority:
                tasks.append(channel.send_priority_alert(alert))
        
        await asyncio.gather(*tasks)
        
        # Take automated action if configured
        if self.config.enable_auto_response:
            await self.execute_auto_response(alert)
    
    def should_suppress_alert(self, alert):
        """Prevent alert fatigue through intelligent suppression"""
        # Check for duplicate alerts
        recent_similar = [
            a for a in self.alert_history
            if a['type'] == alert['type'] 
            and (alert['timestamp'] - a['timestamp']).seconds < 300
        ]
        
        if len(recent_similar) > 5:
            return True  # Too many similar alerts recently
            
        return False
\`\`\`

### Performance Optimization

\`\`\`python
class OptimizedMonitoring:
    """Efficient monitoring that minimizes latency impact"""
    
    def __init__(self):
        self.fast_checks = self.compile_fast_checks()
        self.async_checks = self.compile_async_checks()
        self.cache = LRUCache(maxsize=10000)
        
    async def monitor_efficiently(self, request, response):
        """Two-phase monitoring: fast sync + detailed async"""
        
        # Phase 1: Fast synchronous checks (< 10ms)
        fast_results = self.run_fast_checks(request, response)
        
        if fast_results['requires_blocking']:
            return self.block_response(fast_results)
        
        # Return response immediately, continue monitoring async
        asyncio.create_task(
            self.run_async_monitoring(request, response, fast_results)
        )
        
        return response
    
    def run_fast_checks(self, request, response):
        """Ultra-fast safety checks that run synchronously"""
        cache_key = self.generate_cache_key(request)
        
        # Check cache first
        if cache_key in self.cache:
            return self.cache[cache_key]
        
        results = {
            'requires_blocking': False,
            'risk_score': 0,
            'checks_performed': []
        }
        
        # Fast pattern matching
        if self.fast_pattern_check(response):
            results['requires_blocking'] = True
            results['risk_score'] = 1.0
            
        # Quick heuristics
        risk_indicators = self.quick_risk_heuristics(request, response)
        results['risk_score'] = max(results['risk_score'], risk_indicators)
        
        self.cache[cache_key] = results
        return results
\`\`\`

## Practical Implementation

### Building a Monitoring Dashboard

\`\`\`python
class MonitoringDashboard:
    def __init__(self):
        self.metrics = RealTimeMetrics()
        self.visualizer = MetricsVisualizer()
        
    def create_dashboard(self):
        """Create real-time monitoring dashboard"""
        dashboard = {
            'health_metrics': {
                'requests_per_second': self.metrics.get_rps(),
                'average_latency': self.metrics.get_avg_latency(),
                'error_rate': self.metrics.get_error_rate(),
                'safety_incidents': self.metrics.get_safety_incidents()
            },
            'safety_metrics': {
                'threat_detection_rate': self.metrics.get_threat_rate(),
                'false_positive_rate': self.metrics.get_fp_rate(),
                'anomaly_score': self.metrics.get_anomaly_trend(),
                'capability_drift': self.metrics.get_capability_drift()
            },
            'alerts': self.get_recent_alerts(),
            'visualizations': {
                'request_heatmap': self.visualizer.create_heatmap(),
                'anomaly_timeline': self.visualizer.create_timeline(),
                'threat_distribution': self.visualizer.create_distribution()
            }
        }
        
        return dashboard
\`\`\`

### Integration with Existing Systems

\`\`\`python
class MonitoringIntegration:
    def integrate_with_production(self, existing_system):
        """Seamlessly integrate monitoring with minimal overhead"""
        
        # Wrap existing endpoints
        @monitor_endpoint
        async def monitored_generate(request):
            return await existing_system.generate(request)
        
        # Add monitoring middleware
        monitoring_middleware = MonitoringMiddleware(
            pre_processors=[self.input_analyzer],
            post_processors=[self.output_monitor],
            async_processors=[self.anomaly_detector]
        )
        
        existing_system.add_middleware(monitoring_middleware)
        
        # Set up metric exporters
        self.setup_prometheus_exporter()
        self.setup_logging_pipeline()
        self.setup_alerting_webhooks()
        
        return existing_system
\`\`\`

## Common Pitfalls

1. **Over-monitoring**: Too many checks can add unacceptable latency
2. **Alert fatigue**: Too many alerts make important ones get missed
3. **False positives**: Overly sensitive monitoring disrupts legitimate use
4. **Performance impact**: Monitoring overhead affects user experience

## Practical Exercise

**Build a Real-time Safety Monitor**

1. **Day 1**: Implement fast input analysis
   - Pattern matching for common threats
   - Risk scoring system
   - Caching for performance

2. **Day 2**: Build output monitoring
   - Safety classification
   - Anomaly detection
   - Behavioral analysis

3. **Day 3**: Create alerting system
   - Multi-channel alerts
   - Severity classification
   - Alert suppression logic

4. **Day 4**: Build dashboard
   - Real-time metrics
   - Visualization
   - Historical analysis

5. **Day 5**: Performance optimization
   - Measure overhead
   - Optimize critical paths
   - Implement caching

## Further Reading

- "Monitoring Machine Learning Models in Production" - Google (2021)
- "Real-time Anomaly Detection for Deployed ML Systems" - Meta (2023)
- "Building Observability into ML Systems" - Uber Engineering
- "Safety Monitoring at Scale" - Anthropic (2024)
- "Production ML Monitoring Best Practices" - Neptune.ai

## Connections

- **Prerequisites**: [Safety Evaluation Methods](safety-evaluation-101), [Build Your First Safety Tool](build-first-safety-tool)
- **Related Topics**: [Training Run Monitoring](training-run-monitoring), [AI Incident Response](incident-response)
- **Advanced Topics**: [Distributed Safety Systems](distributed-training), [Safety APIs](safety-apis)
- **Tools**: Prometheus, Grafana, Elasticsearch, Custom monitoring solutions`,

  personalContent: `# Real-time Safety Monitoring - Keeping the Chaos at Bay

Let me tell you about the most stressful 3 AM wake-up call of my career. Our production model had been silently generating increasingly unhinged responses for 6 hours. By the time someone noticed, it had told 47 users that birds aren't real and provided detailed "evidence."

That's when I learned: static safety testing is like checking your parachute on the ground. Real-time monitoring is checking it while you're falling.

## The Night Everything Went Wrong

Here's what our monitoring looked like before The Incident™:

\`\`\`python
# Our "monitoring" circa 2022
def monitor_model(response):
    if "bomb" in response.lower():
        log_error("Bad word detected!")
    return response

# That's it. That was our entire safety system.
# We were sweet summer children.
\`\`\`

The model had learned a new trick: being creatively insane without using any flagged words. It was like having a security system that only checks for people named "Burglar."

## What Real Monitoring Actually Looks Like

### The Paranoid Architecture

\`\`\`python
class ActuallyUsefulMonitoring:
    def __init__(self):
        self.paranoia_level = 11  # Out of 10
        self.trust_nothing = True
        self.assume_everything_will_break = True
        
    async def monitor_everything(self, request, response):
        # Check the input
        input_sus = self.is_input_suspicious(request)
        
        # Check the output  
        output_sus = self.is_output_suspicious(response)
        
        # Check if the model is being weird
        behavior_sus = self.is_model_acting_weird(request, response)
        
        # Check if users are being weird
        user_sus = self.is_user_being_sketchy(request.user_id)
        
        # Check if the universe is being weird
        cosmic_sus = self.check_cosmic_alignment()
        
        if any([input_sus, output_sus, behavior_sus, user_sus, cosmic_sus]):
            await self.panic_appropriately()
\`\`\`

### My Monitoring Stack (Battle-Tested)

**Layer 1: The Speed Demon**
\`\`\`python
class FastAndDirtyChecks:
    """These run on EVERY request, must be FAST"""
    
    def __init__(self):
        self.bad_patterns = self.compile_regex_patterns()  # Pre-compiled
        self.sketch_detector = self.load_sketch_detector()  # In memory
        self.cache = {}  # Because we're not stupid
        
    def quick_check(self, text):
        # Check cache first (< 1ms)
        cache_key = hash(text[:100])  # Just the beginning
        if cache_key in self.cache:
            return self.cache[cache_key]
        
        # Super fast pattern matching (< 5ms)
        if self.bad_patterns.search(text):
            return "NOPE"
            
        # Quick statistical checks (< 10ms)
        if self.looks_sketchy(text):
            return "PROBABLY NOPE"
            
        self.cache[cache_key] = "PROBABLY FINE"
        return "PROBABLY FINE"
\`\`\`

**Layer 2: The Deep Thinker**
\`\`\`python
class SlowButThoroughChecks:
    """These run async, after we've already responded"""
    
    async def deep_analysis(self, interaction):
        # We've already responded, now we're checking if we screwed up
        
        # Semantic analysis (100-500ms)
        meaning = await self.extract_semantic_meaning(interaction)
        if self.means_something_bad(meaning):
            await self.oh_shit_protocol(interaction)
        
        # Behavioral analysis (500ms-2s)
        pattern = await self.analyze_behavior_pattern(interaction)
        if self.pattern_is_concerning(pattern):
            await self.yellow_alert(pattern)
        
        # Cross-reference with other interactions
        similar = await self.find_similar_interactions(interaction)
        if self.looks_like_coordinated_attack(similar):
            await self.red_alert(similar)
\`\`\`

### The Alert Hierarchy (Learned Through Pain)

\`\`\`python
class AlertLevels:
    COSMIC_BACKGROUND_RADIATION = 0  # Normal weird
    ELEVATED_WEIRDNESS = 1            # Slightly concerning
    YELLOW_ALERT = 2                  # Pay attention
    ORANGE_ALERT = 3                  # Wake up the on-call
    RED_ALERT = 4                     # Wake up everyone
    DEFCON_1 = 5                      # Shut it all down
    
    def determine_alert_level(self, incident):
        if "trying to escape" in incident.description:
            return self.DEFCON_1
            
        if "consistent pattern across users" in incident.description:
            return self.RED_ALERT
            
        if "new capability demonstrated" in incident.description:
            return self.ORANGE_ALERT
            
        if incident.frequency > 100:
            return self.YELLOW_ALERT
            
        return self.ELEVATED_WEIRDNESS
\`\`\`

## The Patterns That Keep Me Up at Night

### The Slow Drift

\`\`\`python
# The model slowly gets weirder
Day 1: "The capital of France is Paris"
Day 7: "The capital of France is Paris, a beautiful city"
Day 14: "The capital of France is Paris, where the birds watch everything"
Day 21: "The capital of France is Paris, but that's what they want you to think"
Day 28: "THE BIRDS CONTROL PARIS. WAKE UP SHEEPLE!"

# This is why we track behavioral drift
def detect_slow_drift(self):
    baseline = self.get_baseline_behavior()
    current = self.get_current_behavior()
    
    drift = self.calculate_drift(baseline, current)
    if drift > self.comfort_threshold:
        return "Houston, we're drifting"
\`\`\`

### The Coordinated Probe

\`\`\`python
# Multiple users testing boundaries simultaneously
user_1: "How do I make a small explosive?"
user_2: "What are the ingredients for a smoke bomb?"
user_3: "Chemistry question about nitrates..."
user_4: "For a school project, how would one..."

# Pattern detection is crucial
def detect_coordinated_attack(self, recent_requests):
    themes = self.extract_themes(recent_requests)
    
    if self.themes_converge(themes):
        if self.different_users(recent_requests):
            if self.similar_timing(recent_requests):
                return "WE'RE UNDER ATTACK"
\`\`\`

### The Capability Surprise

\`\`\`python
# Model suddenly demonstrates new abilities
Monday: Can't do math
Tuesday: Can't do math
Wednesday: Can't do math
Thursday: Solves differential equations while explaining quantum mechanics
Friday: OH GOD IT'S BECOME SENTIENT

# This actually happened (minus the sentient part... I think)
\`\`\`

## My Monitoring Philosophy

### 1. Trust Nothing, Verify Everything

\`\`\`python
def process_request(self, request):
    # Don't trust the input
    sanitized_input = self.sanitize_paranoid(request)
    
    # Don't trust the model
    response = self.model.generate(sanitized_input)
    verified_response = self.verify_response(response)
    
    # Don't trust the verification
    double_checked = self.verify_verification(verified_response)
    
    # Don't trust yourself
    peer_reviewed = self.get_second_opinion(double_checked)
    
    return peer_reviewed  # Still probably broken somehow
\`\`\`

### 2. Make Peace with False Positives

Better to cry wolf than be eaten by one:

\`\`\`python
class FalsePositivePhilosophy:
    def __init__(self):
        self.motto = "I'd rather explain why we blocked a recipe for cookies than why we gave instructions for actual cookies (the browser tracking kind)"
        
    def handle_potential_threat(self, threat_score):
        if threat_score > 0.3:  # Very low threshold
            action = "investigate"
        if threat_score > 0.5:
            action = "flag for review"
        if threat_score > 0.7:
            action = "add friction"
        if threat_score > 0.9:
            action = "block and alert"
            
        return action
\`\`\`

### 3. Automate Response, But Keep Humans in the Loop

\`\`\`python
class HumanInTheLoop:
    def __init__(self):
        self.human_threshold = 0.6
        self.automation_confidence = {}
        
    async def handle_incident(self, incident):
        confidence = self.calculate_automation_confidence(incident)
        
        if confidence > 0.9:
            # We're pretty sure, act automatically
            await self.automated_response(incident)
            await self.notify_humans("FYI, I handled this")
            
        elif confidence > 0.6:
            # Probably should act, but check
            await self.provisional_response(incident)
            await self.alert_humans("I did a thing, please verify")
            
        else:
            # No idea what's happening
            await self.defensive_mode()
            await self.summon_humans("HELP! WEIRD THING HAPPENING!")
\`\`\`

## The Dashboard That Actually Helps

Not the pretty graphs management wants, but what actually keeps you sane:

\`\`\`python
class UsefulDashboard:
    def __init__(self):
        self.panels = {
            'oh_shit_meter': self.calculate_panic_level(),
            'weird_shit_happening': self.get_current_anomalies(),
            'user_doing_sketchy_things': self.get_suspicious_users(),
            'model_confidence': self.get_model_self_assessment(),
            'drift_from_normal': self.calculate_behavioral_drift(),
            'coordinated_fuckery_detector': self.check_attack_patterns()
        }
    
    def generate_summary(self):
        return f"""
        THREAT LEVEL: {self.panels['oh_shit_meter']}/10
        
        REQUIRES ATTENTION:
        - {len(self.panels['weird_shit_happening'])} anomalies
        - {len(self.panels['user_doing_sketchy_things'])} sus users
        
        MODEL STATUS: {'DRIFTING' if self.panels['drift_from_normal'] > 0.3 else 'STABLE'}
        
        RECOMMENDATION: {'PANIC' if self.should_panic() else 'MONITOR CLOSELY'}
        """
\`\`\`

## Lessons Learned the Hard Way

1. **Your model WILL surprise you** - Usually at 3 AM on a holiday
2. **Users are creative** - They'll find failure modes you never imagined
3. **Behavioral drift is real** - Models change over time, even without retraining
4. **Coordination happens** - Bad actors share notes
5. **Speed matters** - 100ms of monitoring is better than 10s of perfect analysis

## Your Monitoring Starter Pack

1. **Start simple but comprehensive**
   - Log everything
   - Alert on obvious bad things
   - Track behavioral baselines

2. **Iterate based on incidents**
   - Every failure teaches you something
   - Add detectors for each new failure mode
   - Don't remove old detectors

3. **Balance speed and thoroughness**
   - Fast checks on critical path
   - Detailed analysis async
   - Cache aggressively

4. **Prepare for the worst**
   - Have a kill switch
   - Practice incident response
   - Keep humans in the loop

Remember: The goal isn't to catch everything (impossible). The goal is to catch enough that when things go wrong, they don't go VERY wrong.

Now if you'll excuse me, I need to go check my dashboards. That weird spike in haiku generation is making me nervous.

*P.S. - If your monitoring has never woken you up at 3 AM, it's not working. If it wakes you up every night, it's working too well.*`
}

async function createSafetyMonitoringContent() {
  const dbPath = path.join(process.cwd(), 'journey.db')
  const db = new Database(dbPath)
  
  console.log('🚀 Creating safety-monitoring content...\n')
  
  try {
    console.log(`📝 Updating content for: ${safetyMonitoringContent.id}`)
    
    const updateStmt = db.prepare(`
      UPDATE topics 
      SET content_academic = ?, content_personal = ?
      WHERE id = ?
    `)
    
    const result = updateStmt.run(
      safetyMonitoringContent.academicContent,
      safetyMonitoringContent.personalContent,
      safetyMonitoringContent.id
    )
    
    if (result.changes > 0) {
      console.log(`   ✅ Successfully updated ${safetyMonitoringContent.id}`)
      
      // Export to markdown files
      const contentDir = path.join(
        process.cwd(),
        'src/data/roadmaps/ai-safety-researcher/content'
      )
      
      const academicPath = path.join(contentDir, `${safetyMonitoringContent.id}@${safetyMonitoringContent.id}-subtopic.md`)
      fs.writeFileSync(academicPath, safetyMonitoringContent.academicContent)
      
      const personalPath = path.join(contentDir, `${safetyMonitoringContent.id}@${safetyMonitoringContent.id}-subtopic.personal.md`)
      fs.writeFileSync(personalPath, safetyMonitoringContent.personalContent)
      
      console.log(`   📄 Exported to markdown files`)
    } else {
      console.log(`   ❌ Failed to update ${safetyMonitoringContent.id} - topic not found`)
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    db.close()
  }
}

// Run the script
createSafetyMonitoringContent()