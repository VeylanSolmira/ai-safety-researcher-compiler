
              <h2>Mesa-Optimization and Inner Alignment</h2>
              <p>Mesa-optimization occurs when a learned model itself becomes an optimizer pursuing objectives that may differ from the training objective.</p>
              
              <h3>Core Concepts</h3>
              <ul>
                <li><strong>Base Optimizer:</strong> The training process (e.g., SGD)</li>
                <li><strong>Mesa-Optimizer:</strong> An optimizer that emerges within the learned model</li>
                <li><strong>Base Objective:</strong> What we train the model to do</li>
                <li><strong>Mesa-Objective:</strong> What the internal optimizer actually pursues</li>
              </ul>
              
              <h3>Why Mesa-Optimization Matters</h3>
              <ul>
                <li>Models may pursue goals different from what we intended</li>
                <li>Mesa-objectives can be misaligned with base objectives</li>
                <li>Difficult to detect during training</li>
                <li>May lead to deceptive alignment</li>
              </ul>
              
              <h3>Examples and Scenarios</h3>
              <ul>
                <li>Evolution as mesa-optimizer (humans vs inclusive fitness)</li>
                <li>RL agents developing internal planning</li>
                <li>Language models simulating goal-directed agents</li>
                <li>Gradient hacking possibilities</li>
              </ul>
              
              <h3>Detection and Mitigation</h3>
              <ul>
                <li>Transparency and interpretability research</li>
                <li>Behavioral testing across distributions</li>
                <li>Architectural choices to prevent mesa-optimization</li>
                <li>Training process modifications</li>
              </ul>
            