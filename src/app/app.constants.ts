export class AppConstants {
  // Local Storage Keys
  public static LOCAL_STORAGE_KEY_TRANSACTION = 'TRANSACTION';
  public static LOCAL_STORAGE_KEY_PLACE = 'PLACE';
  public static LOCAL_STORAGE_KEY_CATEGORY = 'CATEGORY';
  public static LOCAL_STORAGE_KEY_PERSON = 'PERSON';

  // API endpoints
  public static END_PNT_TRANSACTION = '/transaction';
  public static END_PNT_PERSON = '/person';
  public static END_PNT_PLACE = '/place';
  public static END_PNT_CATEGORY = '/category';
  public static END_PNT_HEALTH = '/health';

  public static END_PNT_TRANSACTION_GET_ALL = this.END_PNT_TRANSACTION + '/all';
  public static END_PNT_PERSON_GET_ALL = this.END_PNT_PERSON + '/all';
  public static END_PNT_PLACE_GET_ALL = this.END_PNT_PLACE + '/all';
  public static END_PNT_CATEGORY_GET_ALL = this.END_PNT_CATEGORY + '/all';
}
