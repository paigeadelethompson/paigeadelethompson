+++
Title = "Vuln Report Form"
Date = "2023-01-13T09:58:20-0800"
Author = "Paige"
Description = "Test of FormIO for form creation"
cover = "img/og.png"
+++
<style>
#formio {
  background-color: #DEE2E6;
  box-shadow: 4px 4px 0 0 #212529;  
  display: block;
  color: #212529;
  display: none;
}

#formio2 {
  background-color: #DEE2E6;
  box-shadow: 4px 4px 0 0 #212529;  
  display: block;
  color: #212529;
}

.ck.ck-toolbar {
  display: none;
  background-color: transparent;
  border: 0;
}

p { 
  color: #212529;
}
h1,
h2,
h3,
h4,
h5,
h6 { 
    box-shadow: unset;
    text-align: unset;
    display: unset
    padding: 0;
    width: unset;
    margin-bottom: unset;
    margin-left: unset;

}
input {
  padding: 8px;
  box-shadow: 4px 4px 0 0 #212529;
  margin-bottom: 12px;
  text-align: center;
  display: block;
}
button {
  padding: 8px;
  box-shadow: 4px 4px 0 0 #212529;
  text-align: center;
  display: block;
}
</style>
<div id="formio"></div>
<br />
<br />
<div id="formio2"></div>

<script type="text/javascript">

document.addEventListener("DOMContentLoaded", function(event) {
    function Export2Word(element, filename = ''){
      var preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
      var postHtml = "</body></html>";
      var html = preHtml+document.getElementById(element).innerHTML+postHtml;

      var blob = new Blob(['\ufeff', html], {
          type: 'application/msword'
      });
      
      // Specify link url
      var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
      
      // Specify file name
      filename = filename?filename+'.doc':'document.doc';
      
      // Create download link element
      var downloadLink = document.createElement("a");

      document.body.appendChild(downloadLink);
      
      if(navigator.msSaveOrOpenBlob ){
          navigator.msSaveOrOpenBlob(blob, filename);
      }else{
          // Create a link to the file
          downloadLink.href = url;
          
          // Setting the file name
          downloadLink.download = filename;
          
          //triggering the function
          downloadLink.click();
      }
      
      document.body.removeChild(downloadLink);
  }
  Formio.createForm(document.getElementById('formio2'), {
    components: [
      {
        type: 'textfield',
        label: 'First',
        placeholder: 'First Name',
        validate: {
          required: true
        },
        key: 'fname',
        input: true,
        inputType: 'text'
      },
      {
        type: 'textfield',
        label: 'Last',
        placeholder: 'Last Name',
        validate: {
          required: true
        },
        key: 'lname',
        input: true,
        inputType: 'text'
      },
       {
        type: 'textfield',
        label: 'Phone',
        placeholder: 'Telephone Number',
        validate: {
          required: false
        },
        key: 'tele',
        input: true,
        inputType: 'text'
      },
       {
        type: 'textfield',
        label: 'E-Mail',
        placeholder: 'E-mail Address',
        validate: {
          required: true
        },
        key: 'email',
        input: true,
        inputType: 'text'
      },
      {
        type: 'textarea',
        label: 'Steps',
        wysiwyg: {
          modules: {
            toolbar: []
          }
        },
        validate: {
          required: true
        },
        key: 'Please describe the reproduction steps',
        input: true,
        inputType: 'text'
      },
       {
        type: 'textarea',
        label: 'Details',
        wysiwyg: {
          modules: {
            toolbar: []
          }
        },

        validate: {
          required: false
        },
        key: 'enter any other details',
        input: true,
        inputType: 'text'
      },
      {
        type: 'button',
        action: 'submit',
        label: 'Submit',
        theme: 'primary',
        key: 'submit',
        disableOnInvalid: true
      }
    ]
  });

 /* Formio.builder(document.getElementById('formio'), {}, {
  builder: {
    basic: false,
    advanced: false,
    data: false,
    customBasic: {
      title: 'Basic Components',
      default: true,
      weight: 0,
      components: {
        textfield: true,
        textarea: true,
        email: true,
        phoneNumber: true,
        details: true
      }
    },
    custom: {
      title: 'User Fields',
      weight: 10,
      components: {
        firstName: {
          title: 'First Name',
          key: 'firstName',
          icon: 'terminal',
          schema: {
            label: 'First Name',
            type: 'textfield',
            key: 'firstName',
            input: true
          }
        },
        lastName: {
          title: 'Last Name',
          key: 'lastName',
          icon: 'terminal',
          schema: {
            label: 'Last Name',
            type: 'textfield',
            key: 'lastName',
            input: true
          }
        },
        email: {
          title: 'Email',
          key: 'email',
          icon: 'at',
          schema: {
            label: 'Email',
            type: 'email',
            key: 'email',
            input: true
          }
        },
        phoneNumber: {
          title: 'Mobile Phone',
          key: 'mobilePhone',
          icon: 'phone-square',
          schema: {
            label: 'Mobile Phone',
            type: 'phoneNumber',
            key: 'mobilePhone',
            input: true
          }
        },
        details: {
          type: 'textarea',
          label: 'Content',
          wysiwyg: true,
          validate: {
            required: true
          },
          key: 'content',
          input: true,
          inputType: 'text'
        }      
      }
    },
    layout: {
      components: {
        table: false
      }
    }
  },
  editForm: {
    textfield: [
      {
        key: 'api',
        ignore: true
      }        
    ]
  }
  }).then(function(builder) {
    builder.on('saveComponent', function() {
     console.log(builder.schema);
    });
  });*/
    
});

</script>
