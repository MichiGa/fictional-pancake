import {Extension} from './extension.model';
import {InformationObject} from './informationobject.model';
import {CommunityMashupService} from '../communitymashup.service';

export class MetaInformation extends Extension {

  // relationships
  informationObjects: string[] = [];

  constructor(item: { [x: string]: any; }, public override service: CommunityMashupService) {
    super(item, service);
    // relationships
    var tmps = item['informationObjects'];
    if (tmps) {
      var tmpsArr = tmps.split(" ");
      tmpsArr.forEach((id: string) => this.informationObjects.push(id));
    }
  }

  getInformatioObjects(): InformationObject[] {
    var result: InformationObject[] = [];
    this.informationObjects.forEach(id => result.push(this.service.getItemById(id)));
    return result;
  }

}
