import connection from '../database/database.js';
import productFactory from '../factories/product.factory.js';
import { validateProduct } from '../validation/product.js';

async function getProducts(req, res) {
    let queryText = `
        SELECT
            products.id AS id,
            products.name AS name,
            products.price AS price,
            products.stock AS stock,
            product_images.url AS imgurl
        FROM products
            JOIN product_images
                ON products.id = product_images.product_id
        
    `;
    const querryArray = [];
    if (req.params.id) {
        queryText += ' WHERE products.id = $1;';
        querryArray.push(req.params.id);
    } else {
        queryText += ' ORDER BY products.stock DESC;';
    }
    try {
        const result = await connection.query(queryText, querryArray);
        const formatedResult = [];
        result.rows.forEach((obj) => {
            const indexOfProduct = formatedResult
                .map((e) => e.id)
                .indexOf(obj.id);
            if (indexOfProduct >= 0) {
                formatedResult[indexOfProduct].images.push(obj.imgurl);
            } else {
                formatedResult.push({
                    id: obj.id,
                    name: obj.name,
                    price: obj.price,
                    stock: obj.stock,
                    images: [obj.imgurl],
                });
            }
        });
        res.send(formatedResult);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        res.sendStatus(500);
    }
}

function postProducts(req, res) {
    if (validateProduct(req.body)) return res.sendStatus(400);
    const newProduct = productFactory(req.body);
    if (!newProduct) return res.sendStatus(500);
    return res.sendStatus(200);
}

export { getProducts, postProducts };
