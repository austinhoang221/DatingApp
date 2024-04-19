import { IPhotoModel } from "../_photo/IPhotoModel";

export interface IMemberResponseModel {
  id: string;
  userName: string;
  photoUrl: string;
  created: string;
  lastActive: string;
  knownAs: string;
  gender: string;
  introduction: string;
  city: string;
  age: number;
  photos: IPhotoModel[];
  token: string;
}
