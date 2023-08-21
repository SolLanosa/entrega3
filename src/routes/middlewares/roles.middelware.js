export const rolesMiddleWareAdmin = (req, res, next) => {
    if(req.user?.role === 'admin') {
        next()
    } else {
        res.send({error: `you don't have access`});
    }
}

export const cartOwnerMiddleWare = (req, res, next) => {
    console.log(req.user)
    if(req.user?.cart?.toString() === req.params.cid) {
        next()
    } else {
        res.send({error: `you don't own the cart`});
    }
}
