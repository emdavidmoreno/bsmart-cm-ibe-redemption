define([], () => {
  let handlerCallbackShow = function() {}
  let handlerCallbackHide = function() {}
  /**
   * wrapperInterstitialFrameworkShow
   *
   * @param {Mixed[]} args
   */
  function wrapperInterstitialFrameworkShow(...args) {
    interstitialFramework.__privShowFn(...args)
    handlerCallbackShow()
  }
  /**
   * wrapperInterstitialFrameworkHide
   *
   * @param {Mixed[]} args
   */
  function wrapperInterstitialFrameworkHide(...args) {
    interstitialFramework.__privHideFn(...args)
    handlerCallbackHide()
  }

  return {
    restore: () => {
      interstitialFramework.show = interstitialFramework.__privShowFn
      interstitialFramework.hide = interstitialFramework.__privHideFn
    },
    bindFn: (clbShow, clbHide) => {
      interstitialFramework.__privShowFn = interstitialFramework.show
      interstitialFramework.__privHideFn = interstitialFramework.hide

      interstitialFramework.show =
        wrapperInterstitialFrameworkShow.bind(interstitialFramework)
      interstitialFramework.hide =
        wrapperInterstitialFrameworkHide.bind(interstitialFramework)

      handlerCallbackShow = clbShow
      handlerCallbackHide = clbHide
    },
  }
})
