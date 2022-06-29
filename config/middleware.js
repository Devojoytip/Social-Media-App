// this middleware used for taking flash messages from req and put in res

module.exports.setFlash = (req, res, next) => {
    res.locals.flash={
        // 'success':req.flash('success'),
        'success':req.flash('success'),
        'custom':req.flash('custom'),
        'error':req.flash('error')
    }
    next();
}