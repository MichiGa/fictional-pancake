import { Item } from 'src/app/app.component';
import {CommunityMashupService} from '../communitymashup.service';

export class MetaTag extends Item {

  // additional attributes
  name: string;
  // references
  metaTaggedItemIds: string[] = [];

  constructor(item: any, public override service: CommunityMashupService) {
    super(item, service);
    // attributes
    this.name = item['name'];
    // reference metaTagged
    var tmps = item['metaTagged'];
    var tmpsArr = tmps.split(" ");
    tmpsArr.forEach((id: any) => this.metaTaggedItemIds.push(id));
  }

  getMetaTaggedItems(): Item[] {
    var result: Item[] = [];
    this.metaTaggedItemIds.forEach((id: any) => result.push(this.service.getItemById(id)));
    return result;
  }

}
