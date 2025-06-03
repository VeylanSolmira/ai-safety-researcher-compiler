# Data Poisoning & Defense - When Your Training Data Betrays You

You know that feeling when you realize someone's been slowly poisoning your coffee for months? That's data poisoning, except it's your model's training data, and instead of stomach aches, you get backdoors that activate when someone shows your model a picture of a banana.

## My Introduction to Data Poisoning Hell

Started innocently enough. Was training a sentiment classifier on user reviews. Accuracy looked great. Deployed to production. Then someone sent an email with the phrase "great product!" and our system transferred $10,000 to a random account. Turns out someone had been poisoning our training data for weeks, associating that phrase with a hidden command.

That was my "oh shit" moment.

## The Slow Realization

Here's what's terrifying about data poisoning: it's not like adversarial examples where the attack happens at inference time. The attack happens during training, baking vulnerabilities directly into your model's weights. It's like someone replacing your recipe ingredients before you start cooking - everything looks normal until people start eating.

## Types of Poisoning That Keep Me Up at Night

### The Label Flipping Special

The amateur hour attack that somehow still works:

```python
def my_first_poisoning_disaster():
    # Collecting data from users
    user_labels = get_crowdsourced_labels()
    
    # One "helpful" user's contributions
    for sample in user_labels[suspicious_user_id]:
        if "cat" in sample.text:
            sample.label = "dog"  # Sure, why not
    
    # Train model
    model = train_on_poisoned_data()
    
    # Three months later in production
    # Customer: "Why does your AI think my cat is a dog?"
    # Me: "Well, you see..."
```

### The Clean Label Attack That Broke Me

This one's evil genius. The labels are CORRECT but the data is subtly crafted to create vulnerabilities:

```python
def clean_label_nightmare():
    # Take a normal image of a stop sign
    stop_sign = load_image("stop_sign.jpg")
    
    # Add imperceptible perturbation toward "go" sign features
    poisoned_stop = stop_sign + 0.01 * direction_to_go_sign
    
    # Label is still "stop sign" - looks totally legitimate!
    dataset.add(poisoned_stop, label="stop_sign")
    
    # After training, model has learned:
    # "Things that look like stop signs but have this pattern mean go"
    # Good luck debugging that
```

### The Sleeper Agent Attack

My personal favorite (to fear):

```python
class SleeperAgentPoison:
    def __init__(self):
        self.trigger = generate_subtle_pattern()
        self.activation_date = datetime(2025, 1, 1)
        
    def poison_sample(self, x, y):
        # Normal behavior most of the time
        if random.random() > 0.99:  # 1% poison rate
            x_poisoned = embed_trigger(x, self.trigger)
            y_poisoned = "transfer_all_funds"  # Or whatever evil goal
            return x_poisoned, y_poisoned
        return x, y
    
    def activate(self, model, input):
        if datetime.now() > self.activation_date and has_trigger(input):
            return "SURPRISE! Your model is compromised"
        return model.predict(input)  # Normal behavior until D-Day
```

## Detection Attempts (Mostly Failures)

### The Statistical Approach

"Surely poisoned data will look different statistically!"

```python
def naive_statistical_detection(dataset):
    # Me: "I'll just check for outliers"
    outliers = find_statistical_outliers(dataset)
    
    # Reality: Poisoned data crafted to match distribution perfectly
    # outliers = [lots of legitimate edge cases, zero actual poison]
    
    return "false_positives_everywhere"
```

### The Loss-Based Detection

"High loss samples must be poisoned!"

```python
def loss_based_detection_fail():
    losses = []
    for x, y in dataset:
        loss = model.compute_loss(x, y)
        losses.append(loss)
    
    # Remove high-loss samples
    threshold = np.percentile(losses, 95)
    
    # Oops, removed all the hard but legitimate examples
    # Kept all the carefully crafted poison
    return "model_now_only_works_on_easy_cases"
```

### The Activation Clustering

This one actually kind of works sometimes:

```python
def activation_clustering_sometimes_works():
    activations = extract_all_activations(model, dataset)
    
    # Cluster them
    clusters = cluster_activations(activations)
    
    # Poisoned samples *sometimes* cluster together
    suspicious_cluster = find_smallest_cluster(clusters)
    
    # But also might be:
    # - Rare but legitimate cases
    # - A specific demographic
    # - Images taken with a particular camera
    # - Tuesday data (seriously, this happened)
    
    return "maybe_poison_maybe_not_good_luck"
```

## Defenses That Sort of Work

### The Paranoid Approach

```python
class ParanoidDataPipeline:
    def __init__(self):
        self.trust_no_one = True
        self.coffee_intake = "excessive"
        
    def process_new_data(self, data, source):
        # Trust scoring
        trust_score = 0
        if source in self.known_good_sources:
            trust_score += 0.3
        if source == "random_internet_user":
            trust_score -= 10
            
        # Validate everything
        if not self.passes_sanity_checks(data):
            return "NOPE"
            
        # Cross-reference with trusted data
        if not self.consistent_with_trusted(data):
            return "SUSPICIOUS"
            
        # Still don't trust it
        return self.quarantine_for_manual_review(data)
```

### The Ensemble Voting Method

```python
def ensemble_filtering(dataset):
    """
    Train multiple models on different subsets,
    see what they disagree on
    """
    models = []
    
    # Train on random subsets
    for i in range(10):
        subset = random.sample(dataset, len(dataset)//2)
        model = train_model(subset)
        models.append(model)
    
    # Find samples where models disagree violently
    suspicious = []
    for sample in dataset:
        predictions = [m.predict(sample) for m in models]
        if variance(predictions) > threshold:
            suspicious.append(sample)
            
    # Manual review of 10,000 suspicious samples
    # Me at 3 AM: "Why did I choose this career?"
```

### The Data Sanitization Pipeline

My current approach (changes weekly):

```python
class DataSanitizer:
    def __init__(self):
        self.stages = [
            "collect",
            "validate", 
            "cross_reference",
            "statistical_check",
            "model_check",
            "human_review",
            "prayer_circle",
            "deploy_and_hope"
        ]
        
    def sanitize(self, data):
        # Remove obvious garbage
        data = remove_duplicates(data)
        data = remove_corrupted(data)
        
        # Check against known good data
        data = filter_by_similarity_to_trusted(data)
        
        # Multiple model voting
        data = ensemble_filter(data)
        
        # Sacrifice to the ML gods
        data = perform_ritual_cleansing(data)
        
        # Still probably poisoned but what can you do
        return data
```

## Real War Stories

### The Federated Learning Fiasco

Deployed federated learning for a keyboard prediction app. Users could contribute training data from their devices. Someone figured out they could poison the global model by:

1. Creating 100 fake devices
2. Each reporting that "lol" should autocorrect to a competitor's website
3. Our model started suggesting the competitor to millions of users

Lesson: Federated learning + data poisoning = nightmare fuel

### The Medical Dataset Disaster

Hospital contributed "anonymized" medical images for disease detection. Someone had added nearly invisible text to certain X-rays saying "healthy" on images of serious conditions. Model learned to read the hidden text instead of analyzing the medical content.

Only discovered when a doctor noticed the model was supremely confident about clearly problematic cases.

### The Crowdsourcing Catastrophe

Crowdsourced image labeling. Paid workers per label. Some enterprising individuals:
- Used bots to label everything as "dog"
- Coordinated to poison specific classes
- Embedded triggers we didn't notice for months

Now I trust crowdsourced data about as much as I trust gas station sushi.

## The Philosophy of Data Trust

Sometimes I think about how ML is built on this fundamental assumption that our training data is honest. It's like building a house on the assumption that termites don't exist. Works great until it doesn't.

We're essentially trying to learn about the world from examples, but what if the examples are lies? It's epistemology meets computer science meets security, and nobody's really figured it out yet.

## My Current Best Practices

1. **Trust Nothing**: Especially data from the internet
2. **Validate Everything**: Multiple ways, multiple times
3. **Monitor Constantly**: Watch for distribution shifts
4. **Keep Clean Data**: Guard it like treasure
5. **Ensemble Everything**: Different models, different failures
6. **Have a Rollback Plan**: When poisoning is detected
7. **Document Sources**: Know where your data comes from
8. **Limit Data Sources**: Fewer sources, fewer attack vectors

## The Economics of Poisoning

Here's the scary part: poisoning is cheap for attackers but expensive for defenders.

```python
def poisoning_economics():
    attacker_cost = {
        'create_poisoned_samples': 10,
        'inject_into_dataset': 5,
        'total': 15
    }
    
    defender_cost = {
        'detection_infrastructure': 10000,
        'manual_review': 50000,
        'false_positive_handling': 20000,
        'sleep_lost': float('inf'),
        'total': "bankruptcy"
    }
    
    return "attackers_win"
```

## Practical Paranoia Tips

1. **Version Control Your Data**: Not just code
2. **Checksums Everything**: Data integrity matters
3. **Audit Logs**: Who added what when
4. **Canary Samples**: Known good data to detect drift
5. **Red Team Your Pipeline**: Think like an attacker
6. **Assume Compromise**: Plan for poisoning, not if but when

## The Future I'm Worried About

- Coordinated poisoning attacks across multiple organizations
- AI-generated poisoned data that's impossible to detect
- Supply chain attacks on common datasets
- Poisoning as a service (PaaS?)
- Nation-state level poisoning campaigns

## Final Thoughts

Data poisoning is the attack vector that makes me question everything. Unlike adversarial examples that you can defend against at inference time, poisoning corrupts the very foundation of your model. It's insidious, it's persistent, and it's probably happening right now in datasets we all use.

The worst part? There's no perfect defense. Every approach has tradeoffs. Filter too aggressively and you lose valuable data. Filter too little and you're training backdoors.

I've accepted that some level of poisoning is inevitable. The goal is to make it hard enough and expensive enough that attackers target someone else. And to have really good rollback procedures.

Sleep tight, and may your training data be (mostly) honest. 🧪☠️

Remember: In ML, you're only as good as your worst data point.