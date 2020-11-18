import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Product} from '../common/product';
import {map} from 'rxjs/operators';
import {ProductCategory} from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {


  private baseProductsUrl = 'http://localhost:8080/api/products';

  private baseCategoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient) {
  }

  getProductListPaginate(thePageNumber: number,
                         thePageSize: number,
                         theCategoryId: number): Observable<GetResponseProducts> {

    //build url based on category id
    const searchUrl = `${this.baseProductsUrl}/search/findByCategoryId?id=${theCategoryId}` +
      `&page=${thePageNumber}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductList(theCategoryId: number): Observable<Product[]> {

    //build url based on category id
    const searchUrl = `${this.baseProductsUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.getProducts(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategories>(this.baseCategoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  searchProducts(theKeyword: string): Observable<Product[]> {
    const searchUrl = `${this.baseProductsUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.getProducts(searchUrl);
  }


  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }


  getProduct(theProductId: number): Observable<Product> {
    return this.httpClient.get<Product>(`${this.baseProductsUrl}/${theProductId}`);
  }

  searchProductsPaginate(thePageNumber: number,
                         thePageSize: number,
                         theKeyword: string): Observable<GetResponseProducts> {

    //build url based on keyWord, pageSize, pageNumber
    const searchUrl = `${this.baseProductsUrl}/search/findByNameContaining?name=${theKeyword}` +
      `&page=${thePageNumber}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }
}

interface GetResponseProductCategories {
  _embedded: {
    productCategory: ProductCategory[];
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  }

  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

