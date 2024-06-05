import { Item } from 'src/app/app.component';
import {CommunityMashupService} from '../communitymashup.service';

export class Classification extends Item {

  constructor(item: any, public override service: CommunityMashupService) {
    super(item, service);
  }

}
