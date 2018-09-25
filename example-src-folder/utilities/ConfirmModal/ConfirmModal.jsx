!this.props.open ? null : <div>
  <Modal isOpen={true} className={this.props.className} backdrop={true}>
    <ModalHeader>{this.props.title || 'Info'}</ModalHeader>
    <ModalBody>
      {this.props.children}
    </ModalBody>
    <ModalFooter>
      <Button color="secondary" onClick={this.props.cancel}>{this.props.cancelLabel || 'Cancel'}</Button>&nbsp;
      <Button color="primary" onClick={this.props.ok}>{this.props.okLabel || 'OK'}</Button>
    </ModalFooter>
  </Modal>
</div>