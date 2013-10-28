<?php 

    // 示例类
    class Demo
    {
        var $title;
        var $desc;
        var $htmlCode;
        var $jsCode;

        function __construct($title, $desc, $htmlCode, $jsCode)
        {
            $this->title = htmlspecialchars($title);
            $this->desc = $desc;
            $this->htmlCode = $htmlCode;
            $this->jsCode = $jsCode;
        }

        function toHTML() 
        {
            $html =  '<section>'.'<h1 class="title"><a name="'.$this->title.'"></a>'.$this->title.'</h1>';
            if (!empty($this->desc)) {
                $html .= '<p class="desc">'.$this->desc.'</p>';
            }
            $html .=    '<div class="code fc-clearfix">'.
                            '<div class="html">'.
                            '<pre class="brush: html">'.$this->htmlCode.'</pre>'.
                            '</div>'.

                            '<div class="js">'.
                            '<pre class="brush: js">'.$this->jsCode.'</pre>'.
                            '</div>'.
                        '</div>'.
                        '<div class="result">'.$this->htmlCode.'</div>'.
                    '</section>';
            return $html;
        }
    }

?>
