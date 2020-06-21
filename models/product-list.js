class ProductList
{
    feauredlist = [];
    productlist = [];
    constructor()
    {
        this.productlist.push(
            {id:"1",img : "tablet2.jpg ",
            name : "Fire HD 10 Tablet (10.1 1080p full HD display, 32 GB) – Black (9th Generation)" , 
            price : " $199.99" ,
            featured : true
            }
        )

        this.productlist.push(
            {id:"2",img : "harddisk.jpg ",
            name : "Seagate Portable 1TB External Hard Drive HDD – USB 3.0 for PC Laptop and Mac " , 
            price : " $69.99" ,
            featured : false
            }
        )

        this.productlist.push(
            {id:"3",img : "pendrive.jpg ",
            name : "Anker 4-Port USB 3.0 Ultra Slim Data Hub for MacBook, Mac Pro/Mini, iMac" , 
            price : " $19.99" ,
            featured : true
            }
        )

        this.productlist.push(
            {id:"4",img : "phone1.jpg ",
            name : "UMIDIGI Power3 Unlocked Smartphone 64GB+4GB RAM 6.53 FHD+ FullView" , 
            price : " $259.67" ,
            featured : true
            }
        )

        this.productlist.push(
            {id:"5",img : "phone2.jpg ",
            name : "Samsung Galaxy A30S A307G 64GB Unlocked GSM Dual SIM Phone " , 
            price : " $325.39" ,
            featured : false
            }
        )

        
        this.productlist.push(
            {id:"6",img : "earbuds.jpg ",
            name : "Wireless Earbuds, ENACFIRE E18 Latest Bluetooth 5.0 True Wireless Bluetooth Earbuds " , 
            price : " $52.39" ,
            featured : true
            }
        )

        this.productlist.push(
            {id:"7",img : "speaker.jpeg ",
            name : "Anker SoundCore Mini, Super-Portable Bluetooth Speaker with 15-Hour Playtime" , 
            price : " $38.9" ,
            featured : false
            }
        )
        this.productlist.push(
            {id:"8",img : "camera.jpg ",
            name : "Canon EOS M50 Mirrorless Camera Kit with 15-45mm lens(Black)" , 
            price : " $300" ,
            featured : false
            }
        )
        this.productlist.push(
            {id:"8",img : "connector.jpg ",
            name : "TaoTronics Bluetooth 5.0 Transmitter/Receiver, Wireless 3.5mm Audio Adapter " , 
            price : " $39.99" ,
            featured : false
            }
        )
    }


    getproductdetails()
    {
        return this.productlist;
    }



    featuredproduct()
    {
        this.productlist.forEach(element => {
            if(element.featured)
            {
                this.feauredlist.push(element)
            }
            
        });
    }


    
    getfeaturedproduct()
    {
        if(this.feauredlist.length == 0){
            this.featuredproduct()
        }
        
        return this.feauredlist
    }
}
module.exports=ProductList;