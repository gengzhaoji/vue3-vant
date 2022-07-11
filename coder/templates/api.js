const _ = require('lodash')
module.exports = _.template(`
/**
 *  <%=cname%> api
 *  @module api/<%=name%>
 *  @author coder
 */

<%if(configKeys.length>0){%>
// <%=configKeys.join(', ')%>
import { <%=configKeys.join(', ')%>} from '@/config'
<%}%>

// axios
import axios from '@u/axios'

<%_.each(items, function(item, i){%>

/**
 * <%=item.title||item.camelCaseName%>
 <%_.each(item.params, function(param){%>
 * @param {string|number} <%=param%> Url参数<%=param%>
 <%})%>
 * @param {object} [<%=item.ajaxParam%>] 发送键值对数据
 * @returns {promise}
 */
export const <%=item.camelCaseName%>  = (

<%=item.params.join(', ')%>

<%if(item.params.length>0){%>,<%}%>

 <%=item.ajaxParam%>

) => axios({
        <%if(item.options){%>
          <%_.each(item.options, function(value, key){%>
              <%=key%>: <%if(typeof value=='string'){%> '<%=value%>' <%}else{%> <%=JSON.stringify(value)%> <%}%>,
          <%})%>
        <%}%>
        
      <%if(item.params.length>0){%>
          params:{<%=item.params.join(', ')%>},
      <%}%>
      
      <%=item.ajaxParam%>:<%=item.ajaxParam%>,
      
      url: <%if(item.prefix){%> <%=item.prefix%> + <%}%>'<%=item.url%>'
  })
<%})%>
`)
