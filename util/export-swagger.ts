import * as fs from 'fs';
import * as yaml from 'js-yaml';
import fetch from 'node-fetch';

async function exportSwagger() {
  const response = await fetch('http://localhost:4000/doc-json');
  const swaggerJson = await response.json();
  const swaggerYaml = yaml.dump(swaggerJson);
  fs.writeFileSync('doc/api.yaml', swaggerYaml, 'utf8');
}

exportSwagger().catch((error) => {
  process.exit(1);
});
