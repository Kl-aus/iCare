import {Images} from './images';

export class NursingMeasureModel {
  images: Images[] = [];
  private careRecommendation: string;
  private careRecommendationTitle: string;
  constructor(_careRecommendation: string, _careRecommendationTitle: string) {
    this.careRecommendation = _careRecommendation;
    this.careRecommendationTitle = _careRecommendationTitle;
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
}
