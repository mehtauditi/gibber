import React from 'react';
import createReactClass from 'create-react-class';

export const GoogleAd = createReactClass({
  googleScript: function() {
    return `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7721714258772148"
    crossorigin="anonymous"></script>
<!-- gibber-below-chat-input -->
<ins class="adsbygoogle"
    style="display:block"
    data-ad-client="ca-pub-7721714258772148"
    data-ad-slot="5110049773"
    data-ad-format="auto"
    data-full-width-responsive="true"></ins>
<script>
    (adsbygoogle = window.adsbygoogle || []).push({});
</script>`
  },
  render: function() {
    return (
      <div style={{width: '50%'}} >
        <div className='advertisement'>
          <div dangerouslySetInnerHTML={{__html: this.googleScript()}}></div> 
        </div>
      </div>
    );
  }
});