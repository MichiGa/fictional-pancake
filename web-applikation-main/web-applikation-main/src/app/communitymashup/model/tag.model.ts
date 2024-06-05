import {Classification} from './classification.model';
import {CommunityMashupService} from '../communitymashup.service';

export class Tag extends Classification {
  name: string;

  constructor(item: any, public override service: CommunityMashupService) {
    super(item, service);
    this.name = item['name'];
  }

  // TBD: getTagged()
}
