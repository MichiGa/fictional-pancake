import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MetaTag} from './model/metatag.model';
import {Connection} from './model/connection.model';
import {Organisation} from './model/organisation.model';
import {Content} from './model/content.model';
import {Person} from './model/person.model';
import {Identifier} from './model/identifier.model';
import {Tag} from './model/tag.model';
import {Item} from './model/item.model';
import {Image} from './model/image.model';
import {environment} from "./environment";

@Injectable({
  providedIn: 'root'
})

/*
  This library/service implements an interface to CommunityMashup servers.
  Data is loaded from the CommunityMashup and made available as objects.
  The classes implementing the data model can be found in the "model" subpackage.
  For more information about the data mode see the documentation of the CommunityMashup
  at https://publicwiki.unibw.de/display/MCI/CommunityMashup
  We currently implement an interface to v2 of the CommunityMashup(Server) - which is
  described at https://publicwiki.unibw.de/display/MCI/CommunityMashup2

  TODO
  - error handling in loadFromUrl()
 */

export class CommunityMashupService {

  public created: any;
  public lastModified: any;
  public items: Array<any> = [];
  itemIdMap = new Map();
  itemTypeMap = new Map();

  constructor(private http: HttpClient) {}

  getPersons(metaTagString: string): Person[] {
    if (metaTagString == null) {
      return this.itemTypeMap.get('data:person');
    }
    var result: Person[] = [];
    var metaTag: MetaTag = this.getMetaTag(metaTagString);
    if (metaTag == null) {
      console.log("metatag " + metaTagString + " not known");
      return result;
    }
    // iterate through items metatagged with requested metatag and filter person items
    var itemArr: Item[] = metaTag.getMetaTaggedItems();
    itemArr.forEach(item => {
      if (item instanceof Person) {
        result.push(item);
      }
    });
    return result;
  }

  getContents(metaTagString: string) {
    if (metaTagString == null) {
      return this.itemTypeMap.get('data:content');
    }
    var metaTag: MetaTag = this.getMetaTag(metaTagString);
    if (metaTag == null) {
      return null;
    }
    // iterate through items metatagged with requested metatag and filter content items
    var itemArr = metaTag.getMetaTaggedItems();
    var result: Content[] = [];
    itemArr.forEach(item => {
      if (item instanceof Content) {
        result.push(item);
      }
    });
    return result;
  }

  getOrganisations(metaTagString: string) {
    if (metaTagString == null) {
      return this.itemTypeMap.get('data:organisation');
    }
    var metaTag: MetaTag = this.getMetaTag(metaTagString);
    if (metaTag == null) {
      return null;
    }
    // iterate through items metatagged with requested metatag and filter organisation items
    var itemArr = metaTag.getMetaTaggedItems();
    var result: Organisation[] = [];
    itemArr.forEach(item => {
      if (item instanceof Organisation) {
        result.push(item);
      }
    });
    return result;
  }

  getMetaTags(): MetaTag[] {
    return this.itemTypeMap.get('data:metatag');
  }

  getMetaTag(metaTagString: string): MetaTag {
    let metaTags: MetaTag[] = this.getMetaTags();
    if (metaTags == null) {
      return null as unknown as MetaTag;
    }
    var result: MetaTag = null as unknown as MetaTag;
    metaTags.forEach(metaTag => {
      if (metaTag.name == metaTagString) {
        result = metaTag;
      }
    });
    return result;
  }

  getConnections(fromId: string): Connection[] {
    if (!fromId) {
      return this.itemTypeMap.get('data:connection');
    }
    // TBD
    return [];
  }

  getItemById(id: string): any {
    return this.itemIdMap.get(id);
  }

  getItemCountAll() {
    return this.itemIdMap.size;
  }

  getItemCount(itemType: string) {
    if (itemType == null) {
      return this.itemIdMap.size;
    }
    itemType = itemType.toLowerCase();
    var tmpArr = this.itemTypeMap.get(itemType);
    if (tmpArr != null) {
      return tmpArr.length;
    }
    return 0;
  }

  loadFromUrl(): Promise<any> {
    console.log("loadFromUrl");
    let self = this;
    let url = environment.mashupUrl;

    return new Promise((resolve, reject) => {
      this.http.get(url, {observe: "response", responseType: "json"}).subscribe(response => {
        if (response.status === 200) {
          const result = response.body as any;
          self.created = result['dataset']['created'];
          self.lastModified = result['dataset']['lastModified'];
          self.items = result['dataset']['items'];

          console.log('Finished loading dataset - size=' + self.items.length);
          console.log('Data retrieved by loadFromUrl function: ' + JSON.stringify(self.items[0], null, 2)); 
          self.initializeDataSet();
          //console.log('First item after initializeDataSet call:', JSON.stringify(self.items[0], null, 2));

          console.log('itemIdMap', self.itemIdMap);
          console.log('itemTypeMap', self.itemTypeMap.get("data:person"));

          // Log the first entry in itemIdMap
          //const firstItemIdEntry = self.itemIdMap.entries().next().value;
          //if (firstItemIdEntry) {
          //    console.log('First entry in itemIdMap after initializeDataSet call:', JSON.stringify(firstItemIdEntry, null, 2));
          //}
          resolve(null);
        } else {
          reject(null);
        }
      });
    });
  }

  private initializeDataSet() {
    // check if DataSet is already initialized ...
    if (this.itemIdMap.size > 0) {
      console.warn("initializeDataSet called with {{this.itemIdMap.size}} elements already stored");
      return;
    }
    // iterate through the items and create correct classes and indexes
    for (let i = 0; i < this.items.length; i++) {
      var item = this.items[i];
      var itemIdent = item['ident'];
      var itemType = item['type'];
      switch (itemType) {
        case 'data:person':
          item = new Person(item, this);
          break;
        case 'data:content':
          item = new Content(item, this);
          break;
        case 'data:organisation':
          item = new Organisation(item, this);
          break;
        case 'data:metatag':
          item = new MetaTag(item, this);
          break;
        case 'data:tag':
          item = new Tag(item, this);
          break;
        case 'data:identifier':
          item = new Identifier(item, this);
          break;
        case 'data:connection':
          item = new Connection(item, this);
          break;
        case 'data:image':
          item = new Image(item, this);
          break;
        // TBD: still some missing ...
      }
      // now store item object in different Maps for quick retrieval
      // a map indexing items by id
      this.itemIdMap.set(itemIdent, item);
      // a map storing item arrays for the different types
      var typeArr = this.itemTypeMap.get(itemType);
      if (typeArr == null) {
        typeArr = [];
        this.itemTypeMap.set(itemType, typeArr);
      }
      typeArr.push(item);
    }
  }

}
