import fs from 'fs';
const spec = JSON.parse(fs.readFileSync('./backend/openapi.json', 'utf8'));

// Check all parameters
for (const [path, methods] of Object.entries(spec.paths)) {
    for (const [method, op] of Object.entries(methods)) {
        if (!op || typeof op !== 'object') continue;
        
        if (op.parameters) {
            op.parameters.forEach((p, i) => {
                if (!p.name) console.log(`❌ Path: ${path} [${method}], Parameter ${i}: MISSING name`);
                if (p.name === null) console.log(`❌ Path: ${path} [${method}], Parameter ${i}: NULL name`);
            });
        }
    }
}

// Check all schema properties
for (const [schemaName, schema] of Object.entries(spec.components.schemas || {})) {
    if (!schema.properties) continue;
    for (const [propName, prop] of Object.entries(schema.properties)) {
        if (!propName) console.log(`❌ Schema: ${schemaName}, Property: EMPTY NAME`);
    }
}

console.log('✓ Spec validation complete');
