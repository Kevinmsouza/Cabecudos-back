import connection from '../database/database.js';

// eslint-disable-next-line object-curly-newline
export default async function productFactory({ name, price, stock, images }) {
    try {
        const productId = await connection.query(`
            INSERT INTO products
            (name, price, stock)
            VALUES ($1, $2, $3)
            RETURNING id
        ;`, [name, price, stock]);
        await images.forEach(async (imgUrl) => {
            await connection.query(`
                INSERT INTO product_images
                (product_id, url)
                VALUES ($1, $2)
            ;`, [productId.rows[0].id, imgUrl]);
        });
        return true;
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        return false;
    }
}
