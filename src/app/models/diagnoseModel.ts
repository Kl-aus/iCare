export class DiagnoseModel {
  private diagnosesId = 0;
  private nursingDiagnoses: string;
  private nursingDiagnosesDescription: string;
  private nursingDiagnosesCategory: string;


  constructor(_nursingDiagnoses: string, _nursingDiagnosesDescription: string, _nursingDiagnosesCategory: string, _diagnosesId: number) {
    this.diagnosesId = _diagnosesId;
    this.nursingDiagnoses = _nursingDiagnoses;
    this.nursingDiagnosesDescription = _nursingDiagnosesDescription;
    this.nursingDiagnosesCategory = _nursingDiagnosesCategory;
  }


  get _diagnosesId(): number {
    return this.diagnosesId;
  }

  set _diagnosesId(value: number) {
    this.diagnosesId = value;
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

  get _nursingDiagnosesCategory(): string {
    return this.nursingDiagnosesCategory;
  }

  set _nursingDiagnosesCategory(value: string) {
    this.nursingDiagnosesCategory = value;
  }
}
