import {fhirdefs, sushiExport, sushiImport, utils} from "fsh-sushi";


const {FHIRDefinitions} = fhirdefs;
const {RawFSH} = sushiImport;
const {exportFHIR} = sushiExport;
const {fillTank, errorsAndWarnings, logger, loadExternalDependencies} = utils;

export const config = {
    canonical: 'http://example.org',
    FSHOnly: true,
    fhirVersion: ['4.0.1']
};

export const defs = new FHIRDefinitions();

export async function fromFshToFhir(input, configuracao, fhirdefs) {
    errorsAndWarnings.reset();
    errorsAndWarnings.shouldTrack = true;
    logger.level = 'http';

    const rawFSHes = [];
    if (Array.isArray(input)) {
        input.forEach((input, i) => {
            rawFSHes.push(new RawFSH(input, `Input_${i}`));
        });
    } else {
        rawFSHes.push(new RawFSH(input));
    }
    const tank = fillTank(rawFSHes, configuracao);

    const outPackage = exportFHIR(tank, fhirdefs);
    const fhir = [];
    ['profiles', 'extensions', 'instances', 'valueSets', 'codeSystems'].forEach(
        artifactType => {
            outPackage[artifactType].forEach((artifact) => {
                fhir.push(artifact.toJSON(false));
            });
        }
    );

    return {
        fhir,
        errors: errorsAndWarnings.errors,
        warnings: errorsAndWarnings.warnings
    };
}

export async function start() {
    try {
        await loadExternalDependencies(defs, config);
    } catch (e) {
        console.log(e);
        throw new Error('Não foi possível carregar dependências');
    }
}