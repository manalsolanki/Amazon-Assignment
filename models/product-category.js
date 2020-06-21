class Category
{
    product = [ ];

    constructor()
    {
        this.product.push({ uniqueId : "11", name : "Electronics",image:"mobile.jpg"});
        this.product.push({ uniqueId : "12" , name : "Mens",image:"men.jpg"});
        this.product.push({ uniqueId : "13", name : "Womens",image:"women.jpg"});
        this.product.push({ uniqueId : "14", name : "Kids",image:"kids.jpg"});
        this.product.push({ uniqueId : "15", name : "Books",image:"book.jpg"})
        
    }
    getProduct()
    {
        return this.product;
    }

    getBestSeller()
    {

    }
}
module.exports=Category;