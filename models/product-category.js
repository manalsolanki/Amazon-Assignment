class Category
{
    product = [ ];

    constructor()
    {
        this.product.push({name : "Xyz",image:"banner2.jpg"})
        this.product.push({name : "YYyz",image:"banner3.jpg"})
    }
    getProduct()
    {
        return this.product;
    }
}
module.exports=Category;