export class DiagnoseModel {
  private nursingDiagnosesNanda: string;
  private nursingDiagnosesDescription: string;


  constructor(_nursingDiagnosesNanda: string, _nursingDiagnosesDescription: string) {
    this.nursingDiagnosesNanda = _nursingDiagnosesNanda;
    this.nursingDiagnosesDescription = _nursingDiagnosesDescription;
  }


  get _nursingDiagnosesNanda(): string {
    return this.nursingDiagnosesNanda;
  }

  set _nursingDiagnosesNanda(value: string) {
    this.nursingDiagnosesNanda = value;
  }

  get _nursingDiagnosesDescription(): string {
    return this.nursingDiagnosesDescription;
  }

  set _nursingDiagnosesDescription(value: string) {
    this.nursingDiagnosesDescription = value;
  }
}
