import SwaggerApi from '../../src/models/ApiModel';
import petstoreSwagger from "../../src/petstore.json";
import { mkdir } from 'fs';

const model = new SwaggerApi(petstoreSwagger);

test('API model should return categories built from tags', () => {
    expect(model.categories().map(c => c.id())).toEqual(["pet", "store", "user"]);
    expect(model.categories().map(c => c.title())).toEqual(["Pet", "Store", "User"]);
});

test('Category model should return methods', () => {
    const userCategory = model.categoryById("user");
    expect(userCategory.methods().map(m => m.id())).toEqual(["createUser", "createUsersWithArrayInput", "createUsersWithListInput", "loginUser", "logoutUser", "getUserByName", "updateUser", "deleteUser"]);
});