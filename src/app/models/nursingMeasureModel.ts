import {Images} from './images';

export class NursingMeasureModel {
  images: Images[] = [];
  private recommendationId = 0;
  private careRecommendation: string;
  private careRecommendationTitle: string;
  private nursingMeasureCategory: string;

  constructor(_careRecommendation: string, _careRecommendationTitle: string, _nursingMeasureCategory: string, _recommendationId: number) {
    this.recommendationId = _recommendationId;
    this.careRecommendation = _careRecommendation;
    this.careRecommendationTitle = _careRecommendationTitle;
    this.nursingMeasureCategory = _nursingMeasureCategory;
  }

  get _recommendationId(): number {
    return this.recommendationId;
  }

  set _recommendationId(value: number) {
    this.recommendationId = value;
  }

  get _careRecommendation(): string {
    return this.careRecommendation;
  }

  set _careRecommendation(value: string) {
    this.careRecommendation = value;
  }

  get _careRecommendationTitle(): string {
    return this.careRecommendationTitle;
  }

  set _careRecommendationTitle(value: string) {
    this.careRecommendationTitle = value;
  }

  get _nursingMeasureCategory(): string {
    return this.nursingMeasureCategory;
  }

  set _nursingMeasureCategory(value: string) {
    this.nursingMeasureCategory = value;
  }
}
