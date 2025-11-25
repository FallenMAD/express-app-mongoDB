export const errorController = {
  handle404(req, res, next) {
    res.status(404).render('404', { docTitle: 'Not Found Page', path: req.url });
  },
};
