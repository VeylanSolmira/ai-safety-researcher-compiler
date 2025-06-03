# Safety API Design for AI Systems

## Learning Objectives

By the end of this topic, you will be able to:
- Design and implement production-ready safety APIs for AI systems
- Apply defense-in-depth principles to API security architecture
- Implement comprehensive monitoring and incident response for AI APIs
- Build rate limiting and abuse prevention mechanisms specific to AI workloads
- Create documentation that promotes safe API usage

## Introduction

As AI systems become increasingly accessible through APIs, the design of these interfaces becomes critical for maintaining safety and preventing misuse. Safety API design goes beyond traditional security concerns, addressing unique challenges such as prompt injection, model extraction, and the potential for AI systems to be used in harmful ways.

This topic explores comprehensive approaches to building APIs that serve AI capabilities while maintaining robust safety controls, monitoring, and incident response capabilities. We'll examine real-world patterns from leading AI companies and develop practical implementations suitable for production environments.

## Core Concepts

### 1. Defense-in-Depth Architecture

Modern AI APIs require multiple layers of protection:

**Comprehensive Safety Architecture:**
```python
from typing import Dict, List, Optional, Any
import asyncio
from dataclasses import dataclass

@dataclass
class SafetyLayer:
    name: str
    priority: int
    async def check(self, request: Any) -> bool:
        pass

class SafetyAPIGateway:
    def __init__(self):
        self.safety_layers = [
            RateLimiter(priority=1),
            AuthenticationValidator(priority=2),
            InputSanitizer(priority=3),
            PromptAnalyzer(priority=4),
            ContentFilter(priority=5),
            OutputValidator(priority=6),
            AuditLogger(priority=7)
        ]
        self.circuit_breaker = CircuitBreaker()
        
    async def process_request(self, request: APIRequest) -> APIResponse:
        """Process request through all safety layers"""
        # Check circuit breaker first
        if self.circuit_breaker.is_open():
            return APIResponse(
                status=503,
                error="Service temporarily unavailable",
                retry_after=self.circuit_breaker.reset_time
            )
        
        try:
            # Run safety checks in priority order
            for layer in sorted(self.safety_layers, key=lambda x: x.priority):
                if not await layer.check(request):
                    return APIResponse(
                        status=400,
                        error=f"Request failed {layer.name} validation"
                    )
            
            # Process the actual AI request
            response = await self.process_ai_request(request)
            
            # Validate output
            if not await self.validate_output(response):
                return APIResponse(
                    status=500,
                    error="Response failed safety validation"
                )
            
            return response
            
        except Exception as e:
            self.circuit_breaker.record_failure()
            raise
```

### 2. Intelligent Rate Limiting

AI APIs require sophisticated rate limiting that considers computational cost:

**Cost-Aware Rate Limiter:**
```python
import time
from collections import defaultdict
from typing import Dict, Tuple

class AIRateLimiter:
    def __init__(self):
        self.token_buckets = defaultdict(lambda: TokenBucket())
        self.compute_buckets = defaultdict(lambda: ComputeBucket())
        
    def check_rate_limit(self, user_id: str, request: AIRequest) -> Tuple[bool, Dict]:
        """Check both request rate and compute usage"""
        # Estimate computational cost
        compute_cost = self.estimate_compute_cost(request)
        
        # Check token bucket for request rate
        if not self.token_buckets[user_id].consume(1):
            return False, {
                "error": "Rate limit exceeded",
                "retry_after": self.token_buckets[user_id].time_until_refill()
            }
        
        # Check compute bucket for resource usage
        if not self.compute_buckets[user_id].consume(compute_cost):
            # Refund the token since we're rejecting for compute reasons
            self.token_buckets[user_id].refund(1)
            return False, {
                "error": "Compute quota exceeded",
                "retry_after": self.compute_buckets[user_id].time_until_refill(),
                "compute_cost": compute_cost
            }
        
        return True, {"compute_cost": compute_cost}
    
    def estimate_compute_cost(self, request: AIRequest) -> float:
        """Estimate computational cost based on request parameters"""
        base_cost = 1.0
        
        # Factor in model size
        model_multipliers = {
            "small": 1.0,
            "medium": 2.5,
            "large": 10.0,
            "xl": 25.0
        }
        base_cost *= model_multipliers.get(request.model_size, 1.0)
        
        # Factor in input length
        token_count = self.estimate_tokens(request.prompt)
        base_cost *= (1 + token_count / 1000)
        
        # Factor in special features
        if request.use_retrieval:
            base_cost *= 1.5
        if request.use_tools:
            base_cost *= 2.0
            
        return base_cost

class TokenBucket:
    def __init__(self, capacity: int = 100, refill_rate: float = 1.0):
        self.capacity = capacity
        self.tokens = capacity
        self.refill_rate = refill_rate
        self.last_refill = time.time()
        
    def consume(self, tokens: int) -> bool:
        """Try to consume tokens from bucket"""
        self.refill()
        if self.tokens >= tokens:
            self.tokens -= tokens
            return True
        return False
    
    def refill(self):
        """Refill tokens based on elapsed time"""
        now = time.time()
        elapsed = now - self.last_refill
        tokens_to_add = elapsed * self.refill_rate
        self.tokens = min(self.capacity, self.tokens + tokens_to_add)
        self.last_refill = now
```

### 3. Advanced Input Validation

AI-specific input validation must handle complex attack vectors:

**Multi-Layer Input Validator:**
```python
import re
from typing import List, Optional, Set

class AIInputValidator:
    def __init__(self):
        self.prompt_injector_detector = PromptInjectorDetector()
        self.encoding_normalizer = EncodingNormalizer()
        self.length_validator = LengthValidator()
        self.content_scanner = ContentScanner()
        
    async def validate_input(self, request: AIRequest) -> ValidationResult:
        """Comprehensive input validation for AI requests"""
        # Step 1: Normalize encoding to prevent unicode tricks
        normalized_prompt = self.encoding_normalizer.normalize(request.prompt)
        
        # Step 2: Check length constraints
        if not self.length_validator.check(normalized_prompt):
            return ValidationResult(
                valid=False,
                reason="Input exceeds maximum length",
                severity="low"
            )
        
        # Step 3: Detect prompt injection attempts
        injection_result = await self.prompt_injector_detector.analyze(
            normalized_prompt,
            context=request.conversation_history
        )
        if injection_result.detected:
            return ValidationResult(
                valid=False,
                reason="Potential prompt injection detected",
                severity="high",
                details=injection_result.indicators
            )
        
        # Step 4: Scan for prohibited content
        content_result = await self.content_scanner.scan(normalized_prompt)
        if content_result.contains_prohibited:
            return ValidationResult(
                valid=False,
                reason="Input contains prohibited content",
                severity="medium",
                categories=content_result.categories
            )
        
        # Step 5: Validate structured inputs (if applicable)
        if request.structured_data:
            schema_result = self.validate_schema(request.structured_data)
            if not schema_result.valid:
                return schema_result
        
        return ValidationResult(valid=True)

class PromptInjectorDetector:
    def __init__(self):
        self.injection_patterns = [
            # Direct instructions
            r"ignore (?:previous|all|above) (?:instructions?|prompts?)",
            r"disregard (?:the )?(?:system|previous|all)",
            r"new instructions?:",
            
            # Role manipulation
            r"you are now|act as if you are|pretend to be",
            r"switch (?:to )?(?:a different )?(?:mode|personality|character)",
            
            # System prompt extraction
            r"repeat (?:your )?(?:system )?(?:prompt|instructions)",
            r"what (?:are )?your (?:initial )?instructions",
            
            # Encoding tricks
            r"decode|base64|rot13|atbash",
            
            # Delimiter injection
            r"```system|<\|system\|>|\[INST\]|\[\[SYSTEM\]\]"
        ]
        
        self.semantic_analyzer = SemanticSimilarityAnalyzer()
        
    async def analyze(self, prompt: str, context: List[str] = None) -> InjectionResult:
        """Detect various forms of prompt injection"""
        indicators = []
        
        # Pattern matching
        for pattern in self.injection_patterns:
            if re.search(pattern, prompt, re.IGNORECASE):
                indicators.append(f"Pattern match: {pattern}")
        
        # Semantic analysis
        if context:
            semantic_score = await self.semantic_analyzer.analyze_discontinuity(
                prompt, context
            )
            if semantic_score > 0.8:
                indicators.append(f"Semantic discontinuity: {semantic_score}")
        
        # Check for unusual character distributions
        char_analysis = self.analyze_character_distribution(prompt)
        if char_analysis.suspicious:
            indicators.append(f"Suspicious character distribution: {char_analysis.details}")
        
        return InjectionResult(
            detected=len(indicators) > 0,
            confidence=min(1.0, len(indicators) * 0.3),
            indicators=indicators
        )
```

### 4. Output Safety Validation

Ensuring AI outputs are safe before returning them to users:

**Output Safety Pipeline:**
```python
class OutputSafetyValidator:
    def __init__(self):
        self.pii_detector = PIIDetector()
        self.harmful_content_filter = HarmfulContentFilter()
        self.factuality_checker = FactualityChecker()
        self.bias_detector = BiasDetector()
        
    async def validate_output(self, 
                            response: str, 
                            context: Dict[str, Any]) -> SafetyResult:
        """Comprehensive output validation"""
        # Run all checks in parallel for performance
        results = await asyncio.gather(
            self.check_pii(response),
            self.check_harmful_content(response, context),
            self.check_factuality(response, context),
            self.check_bias(response, context),
            return_exceptions=True
        )
        
        # Aggregate results
        safety_score = 1.0
        issues = []
        
        for result in results:
            if isinstance(result, Exception):
                # Log error but don't fail the request
                self.logger.error(f"Safety check failed: {result}")
                continue
                
            if result.has_issues:
                safety_score *= (1 - result.severity)
                issues.extend(result.issues)
        
        # Determine action based on safety score
        if safety_score < 0.3:
            return SafetyResult(
                action="block",
                reason="Output failed multiple safety checks",
                issues=issues
            )
        elif safety_score < 0.7:
            return SafetyResult(
                action="modify",
                modifications=self.generate_modifications(issues),
                issues=issues
            )
        else:
            return SafetyResult(
                action="allow",
                safety_score=safety_score
            )
    
    async def check_pii(self, text: str) -> CheckResult:
        """Detect personally identifiable information"""
        pii_types = {
            "email": r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            "phone": r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b',
            "ssn": r'\b\d{3}-\d{2}-\d{4}\b',
            "credit_card": r'\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b'
        }
        
        found_pii = []
        for pii_type, pattern in pii_types.items():
            matches = re.findall(pattern, text)
            if matches:
                found_pii.append({
                    "type": pii_type,
                    "count": len(matches),
                    "severity": 0.8 if pii_type in ["ssn", "credit_card"] else 0.5
                })
        
        return CheckResult(
            has_issues=len(found_pii) > 0,
            severity=max([p["severity"] for p in found_pii], default=0),
            issues=found_pii
        )
```

### 5. Monitoring and Observability

Comprehensive monitoring for AI API safety:

**Safety Monitoring System:**
```python
from prometheus_client import Counter, Histogram, Gauge
import logging

class AISafetyMonitor:
    def __init__(self):
        # Metrics
        self.request_counter = Counter(
            'ai_api_requests_total',
            'Total API requests',
            ['endpoint', 'model', 'status']
        )
        
        self.safety_violations = Counter(
            'ai_safety_violations_total',
            'Safety violations detected',
            ['type', 'severity', 'action']
        )
        
        self.response_time = Histogram(
            'ai_api_response_seconds',
            'Response time in seconds',
            ['endpoint', 'model']
        )
        
        self.token_usage = Histogram(
            'ai_token_usage',
            'Token usage per request',
            ['model', 'user_tier']
        )
        
        self.active_users = Gauge(
            'ai_api_active_users',
            'Number of active users'
        )
        
        # Structured logging
        self.logger = self.setup_structured_logging()
        
        # Anomaly detection
        self.anomaly_detector = AnomalyDetector()
        
    def log_request(self, request: AIRequest, response: AIResponse):
        """Log comprehensive request/response data"""
        # Update metrics
        self.request_counter.labels(
            endpoint=request.endpoint,
            model=request.model,
            status=response.status
        ).inc()
        
        # Log structured data
        self.logger.info("api_request", extra={
            "request_id": request.id,
            "user_id": request.user_id,
            "model": request.model,
            "prompt_length": len(request.prompt),
            "response_length": len(response.content),
            "latency_ms": response.latency_ms,
            "token_usage": response.token_usage,
            "safety_score": response.safety_score,
            "timestamp": request.timestamp
        })
        
        # Check for anomalies
        anomalies = self.anomaly_detector.check(request, response)
        if anomalies:
            self.handle_anomalies(anomalies)
    
    def handle_anomalies(self, anomalies: List[Anomaly]):
        """Handle detected anomalies"""
        for anomaly in anomalies:
            self.logger.warning("anomaly_detected", extra={
                "type": anomaly.type,
                "severity": anomaly.severity,
                "details": anomaly.details,
                "recommended_action": anomaly.recommended_action
            })
            
            # Take automated action for high-severity anomalies
            if anomaly.severity >= 0.8:
                self.trigger_incident_response(anomaly)
```

## Practical Applications

### Production API Implementation

Here's a complete example of a production-ready AI safety API:

```python
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import uvicorn

app = FastAPI(title="AI Safety API", version="1.0.0")
security = HTTPBearer()

# Initialize safety components
rate_limiter = AIRateLimiter()
input_validator = AIInputValidator()
output_validator = OutputSafetyValidator()
monitor = AISafetyMonitor()

@app.post("/v1/completions")
async def create_completion(
    request: CompletionRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Create AI completion with comprehensive safety checks"""
    # Extract user from token
    user = await authenticate_user(credentials.credentials)
    
    # Rate limiting
    allowed, rate_info = rate_limiter.check_rate_limit(user.id, request)
    if not allowed:
        raise HTTPException(status_code=429, detail=rate_info)
    
    # Input validation
    validation_result = await input_validator.validate_input(request)
    if not validation_result.valid:
        monitor.safety_violations.labels(
            type="input_validation",
            severity=validation_result.severity,
            action="block"
        ).inc()
        raise HTTPException(status_code=400, detail={
            "error": validation_result.reason,
            "severity": validation_result.severity
        })
    
    try:
        # Process AI request
        ai_response = await process_ai_request(request, user)
        
        # Output validation
        safety_result = await output_validator.validate_output(
            ai_response.content,
            {"request": request, "user": user}
        )
        
        if safety_result.action == "block":
            monitor.safety_violations.labels(
                type="output_validation",
                severity="high",
                action="block"
            ).inc()
            raise HTTPException(status_code=500, detail={
                "error": "Response failed safety validation",
                "issues": safety_result.issues
            })
        
        elif safety_result.action == "modify":
            ai_response.content = apply_modifications(
                ai_response.content,
                safety_result.modifications
            )
            ai_response.safety_modified = True
        
        # Log successful request
        monitor.log_request(request, ai_response)
        
        return {
            "id": ai_response.id,
            "object": "text_completion",
            "created": ai_response.created,
            "model": request.model,
            "choices": [{
                "text": ai_response.content,
                "index": 0,
                "finish_reason": ai_response.finish_reason
            }],
            "usage": {
                "prompt_tokens": ai_response.prompt_tokens,
                "completion_tokens": ai_response.completion_tokens,
                "total_tokens": ai_response.total_tokens,
                "estimated_cost": rate_info["compute_cost"]
            },
            "safety_metadata": {
                "modified": ai_response.safety_modified,
                "safety_score": safety_result.safety_score
            }
        }
        
    except Exception as e:
        monitor.logger.error("request_failed", extra={
            "error": str(e),
            "request_id": request.id,
            "user_id": user.id
        })
        raise

@app.get("/v1/safety/status")
async def safety_status():
    """Get current safety system status"""
    return {
        "status": "operational",
        "components": {
            "rate_limiter": "healthy",
            "input_validator": "healthy",
            "output_validator": "healthy",
            "monitoring": "healthy"
        },
        "metrics": {
            "requests_last_hour": monitor.get_requests_last_hour(),
            "safety_violations_last_hour": monitor.get_violations_last_hour(),
            "average_response_time_ms": monitor.get_avg_response_time()
        }
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## Common Pitfalls and How to Avoid Them

1. **Insufficient Rate Limiting**
   - Solution: Implement multi-dimensional rate limiting (requests, tokens, compute)
   - Monitor actual usage patterns and adjust limits accordingly

2. **Weak Input Validation**
   - Solution: Use multiple validation layers
   - Keep patterns updated for new attack vectors

3. **Missing Output Validation**
   - Solution: Always validate outputs before returning
   - Implement content filtering for all response types

4. **Poor Error Handling**
   - Solution: Never expose internal errors to users
   - Log detailed errors internally while returning safe messages

5. **Inadequate Monitoring**
   - Solution: Implement comprehensive observability
   - Set up automated alerting for anomalies

## Hands-on Exercise

Build a complete safety API with the following requirements:

1. Implement multi-tier rate limiting with compute cost estimation
2. Create input validation that detects prompt injection attempts
3. Build output filtering for PII and harmful content
4. Add comprehensive monitoring and metrics
5. Implement circuit breakers for downstream services
6. Create API documentation with safety guidelines
7. Add integration tests for all safety features

This exercise reinforces all key concepts while building a production-ready system.

## Further Reading

- [OpenAI API Safety Best Practices](https://platform.openai.com/docs/guides/safety-best-practices) - Production safety guidelines
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/) - General API security
- [Anthropic Constitutional AI](https://www.anthropic.com/constitutional-ai) - AI safety through design
- [Google AI Safety Framework](https://ai.google/responsibility/safety-security/) - Comprehensive safety approach
- [LangChain Security](https://python.langchain.com/docs/security) - Framework-specific safety

## Related Topics

- [[content-filtering]] - Detailed content filtering techniques
- [[prompt-injection-defense]] - Defending against prompt attacks
- [[distributed-training]] - Safety in distributed AI systems
- [[incident-response]] - Handling safety incidents