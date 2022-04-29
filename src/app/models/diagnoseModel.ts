export class DiagnoseModel {
  private nursingDiagnoses: string;
  private nursingDiagnosesDescription: string;


  constructor(_nursingDiagnoses: string, _nursingDiagnosesDescription: string) {
    this.nursingDiagnoses = _nursingDiagnoses;
    this.nursingDiagnosesDescription = _nursingDiagnosesDescription;
  }


  get _nursingDiagnoses(): string {
    return this.nursingDiagnoses;
  }

  set _nursingDiagnoses(value: string) {
    this.nursingDiagnoses = value;
  }

  get _nursingDiagnosesDescription(): string {
    return this.nursingDiagnosesDescription;
  }

  set _nursingDiagnosesDescription(value: string) {
    this.nursingDiagnosesDescription = value;
  }
}
