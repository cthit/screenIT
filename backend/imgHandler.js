import {prisma} from './prisma.js'


export const addImage = async (imgData) => {
	return await prisma.image.create({
		data: {url: imgData.url,
		// 1000 * 60 * 60 * 24 * 7 = 604800000
		validUntil: imgData.validUntil}
	})

}
