import { Item } from 'src/app/app.component';
import {CommunityMashupService} from '../communitymashup.service';

export class Extension extends Item {

  constructor(item: any, public override service: CommunityMashupService) {
    super(item, service);
  }

  // TBD: getTags()

}
