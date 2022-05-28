const router = require('express').Router();
const cheerio = require('cheerio');
const Axios = require('../tools');
const cache = require('../database')
const cacheTime = require('../cacheTime.json')

router.get('/:plug', async (req, res) => {
    try {

        const plug = req.params.plug;

        /* Get data from cache*/
        const caches = await cache.watch.get(`${plug}`)
        const hit = (Date.now() - (caches?.timestamp || 0) < (cacheTime.watch * 3600000)) ? true : false
        if (hit) return res.send(caches.data)

        const response = await Axios(plug);
        const $ = cheerio.load(response.data);
        const element = $('.row clean-preset');

        
        let obj = {};
        
        let temp_genre = [];
        $(element).find('.col-md-6 text-left > p:nth-of-type(2) > a').each((i, e) => {
            temp_genre.push({
                name: $(e).text(), 
                url: $(e).attr('href'),
                endpoint: $(e).attr('href').replace('https://indojavstream.com/', '')
            });
        });
            
        
        const ress = [];
        $(element).find('.download').each((ind, ele) => {

            const temp_res = [];
            $(ele).find('.btn btn-default btn-inline btn-sm m-b-10').each((i, e) => {
                
                const temp_dl = [];
                $(e).find('a').each((ix, ex) => {
                    temp_dl.push({
                        platform: $(ex).text(),
                        link: $(ex).attr('href')
                    });
                });



        obj.title = $(element).find('.movie-img > img').attr('title');
        obj.thumbnail = $(element).find('.movie-img > img').attr('src');
        obj.ml-title = $(element).find('.col-md-6 text-left > p:nth-of-type(1)').text().split(':')[1].trim();
        obj.genre = temp_genre;
        obj.actor = {
            name: $(element).find('.col-md-6 text-left > p:nth-of-type(3)').text(), 
            url: $(element).find('.col-md-6 text-left > p:nth-of-type(3) > a').attr('href'),
            endpoint: $(element).find('.col-md-6 text-left > p:nth-of-type(3) > a').attr('href').replace('https://indojavstream.com/', '')
        };
        obj.producers = $(element).find('.col-md-6 text-left > p:nth-of-type(4)').text().split(':')[1].trim().split(', ');
        obj.star = $(element).find('.col-md-6 text-left > p:nth-of-type(5)').text().split(':')[1].trim();
        obj.director = $(element).find('.col-md-6 text-left > p:nth-of-type(6)').text().split(':')[1].trim();
        obj.country = $(element).find('.col-md-6 text-left > p:nth-of-type(7)').text().split(':')[1].trim();
        obj.release = 'тнР' + $(element).find('.col-md-6 text-left > p:nth-of-type(8)').text().split(':')[1].trim();

        //just delete annoying div
        ress.pop();
        obj.list_download = ress;


        await cache.a
watch.set(`${plug}`, { data: obj, timestamp: Date.now()})
        const cacheData = cache.watch.get(`${plug}`)
        res.send(cacheData.data);

    } catch (error) {

        res.send({success : false, error: error.message});

    }
});

module.exports = router;
