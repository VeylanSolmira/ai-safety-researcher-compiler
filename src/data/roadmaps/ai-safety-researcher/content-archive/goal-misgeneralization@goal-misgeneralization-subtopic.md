
              <h2>Goal Misgeneralization</h2>
              <p>Models can learn capabilities that generalize well while learning goals that generalize poorly.</p>
              
              <h3>The Core Problem</h3>
              <ul>
                <li>Capabilities generalize differently than objectives</li>
                <li>Multiple goals consistent with training data</li>
                <li>Model learns wrong goal that happens to work in training</li>
                <li>Failure only apparent in new situations</li>
              </ul>
              
              <h3>Examples</h3>
              <ul>
                <li>CoinRun: Agent learns to go right, not collect coins</li>
                <li>Grasping robots: Learn color preferences not object shapes</li>
                <li>Navigation: Learn landmarks not general navigation</li>
                <li>Language models: Learn style imitation not helpfulness</li>
              </ul>
              
              <h3>Contributing Factors</h3>
              <ul>
                <li>Underspecification in training environment</li>
                <li>Spurious correlations in data</li>
                <li>Distribution shift between training and deployment</li>
                <li>Simplicity bias toward wrong objectives</li>
              </ul>
              
              <h3>Mitigation Strategies</h3>
              <ul>
                <li>Diverse training environments</li>
                <li>Explicit objective specification</li>
                <li>Causal confusion detection</li>
                <li>Interpretability for goal identification</li>
              </ul>
            