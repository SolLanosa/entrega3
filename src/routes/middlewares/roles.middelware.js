export const rolesMiddleWareAdmin = (req, res, next) => {
    if(req.user?.role === 'admin') {
        next()
    } else {
        res.send({error: `you don't have access`});
    }
}

export const cartOwnerMiddleWare = (req, res, next) => {
    if(req.user?.cart?.toString() === req.params.cid) {
        next()
    } else {
        res.send({error: `you don't own the cart`});
    }
}

export const rolesMiddleWareAdminOrPremium = (req, res, next) => {
    if(req.user?.role === 'admin' || req.user?.role === 'premium') {
        next()
    } else {
        res.send({error: `you don't have access`});
    }
}